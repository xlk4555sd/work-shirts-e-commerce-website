import Cycles "mo:base/ExperimentalCycles";
import AccessControl "authorization/access-control";
import Registry "blob-storage/registry";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor Main {
  
  let accessControlState = AccessControl.initState();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  
  let registry = Registry.new();

  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can register file references");
    };
    Registry.add(registry, path, hash);
  };

  public query ({ caller }) func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public query func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can drop file references");
    };
    Registry.remove(registry, path);
  };

  
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    imagePath : Text;
    sizes : [Text];
    colors : [Text];
    inventory : Nat;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var products = textMap.empty<Product>();

  public query func getProducts() : async [Product] {
    Iter.toArray(textMap.vals(products));
  };

  public query func getProduct(productId : Text) : async ?Product {
    textMap.get(products, productId);
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add products");
    };
    products := textMap.put(products, product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update products");
    };
    products := textMap.put(products, product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete products");
    };
    products := textMap.delete(products, productId);
  };

  
  public type CartItem = {
    productId : Text;
    size : Text;
    quantity : Nat;
  };

  public type Cart = {
    items : [CartItem];
    total : Nat;
  };

  var carts = principalMap.empty<Cart>();

  public query ({ caller }) func getCart() : async ?Cart {
    principalMap.get(carts, caller);
  };

  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    let currentCart = switch (principalMap.get(carts, caller)) {
      case null { { items = []; total = 0 } };
      case (?cart) { cart };
    };

    let updatedItems = Array.append(currentCart.items, [item]);
    let updatedTotal = calculateCartTotal(updatedItems);

    carts := principalMap.put(carts, caller, { items = updatedItems; total = updatedTotal });
  };

  public shared ({ caller }) func updateCart(items : [CartItem]) : async () {
    let total = calculateCartTotal(items);
    carts := principalMap.put(carts, caller, { items; total });
  };

  public shared ({ caller }) func clearCart() : async () {
    carts := principalMap.delete(carts, caller);
  };

  func calculateCartTotal(items : [CartItem]) : Nat {
    var total = 0;
    for (item in items.vals()) {
      switch (textMap.get(products, item.productId)) {
        case null {};
        case (?product) {
          total += product.price * item.quantity;
        };
      };
    };
    total;
  };

  
  public type Order = {
    id : Text;
    customerName : Text;
    email : Text;
    shippingAddress : Text;
    items : [CartItem];
    total : Nat;
    status : Text;
    timestamp : Int;
  };

  var orders = textMap.empty<Order>();

  public query func getOrders() : async [Order] {
    Iter.toArray(textMap.vals(orders));
  };

  public query func getOrder(orderId : Text) : async ?Order {
    textMap.get(orders, orderId);
  };

  public shared ({ caller }) func placeOrder(order : Order) : async () {
    orders := textMap.put(orders, order.id, order);
    carts := principalMap.delete(carts, caller);
  };

  public shared ({ caller }) func updateOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update orders");
    };
    orders := textMap.put(orders, order.id, order);
  };

  
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

type __CAFFEINE_STORAGE_RefillInformation = {
    proposed_top_up_amount: ?Nat;
};

type __CAFFEINE_STORAGE_RefillResult = {
    success: ?Bool;
    topped_up_amount: ?Nat;
};

    public shared (msg) func __CAFFEINE_STORAGE_refillCashier(refill_information: ?__CAFFEINE_STORAGE_RefillInformation) : async __CAFFEINE_STORAGE_RefillResult {
    let cashier = Principal.fromText("72ch2-fiaaa-aaaar-qbsvq-cai");
    
    assert (cashier == msg.caller);
    
    let current_balance = Cycles.balance();
    let reserved_cycles : Nat = 400_000_000_000;
    
    let current_free_cycles_count : Nat = Nat.sub(current_balance, reserved_cycles);
    
    let cycles_to_send : Nat = switch (refill_information) {
        case null { current_free_cycles_count };
        case (?info) {
            switch (info.proposed_top_up_amount) {
                case null { current_free_cycles_count };
                case (?proposed) { Nat.min(proposed, current_free_cycles_count) };
            }
        };
    };

    let target_canister = actor(Principal.toText(cashier)) : actor {
        account_top_up_v1 : ({ account : Principal }) -> async ();
    };
    
    let current_principal = Principal.fromActor(Main);
    
    await (with cycles = cycles_to_send) target_canister.account_top_up_v1({ account = current_principal });
    
    return {
        success = ?true;
        topped_up_amount = ?cycles_to_send;
    };
};
    public shared (msg) func __CAFFEINE_STORAGE_blobsToRemove() : async [Text] {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    
    Registry.getBlobsToRemove(registry);
};
    public shared (msg) func __CAFFEINE_STORAGE_blobsRemoved(hashes : [Text]) : async Nat {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    
    Registry.clearBlobsRemoved(registry, hashes);
};
    public shared (msg) func __CAFFEINE_STORAGE_updateGatewayPrincipals() : async () {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    await Registry.updateGatewayPrincipals(registry, "72ch2-fiaaa-aaaar-qbsvq-cai");
};
};
