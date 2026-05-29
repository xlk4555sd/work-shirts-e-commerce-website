export const idlFactory = ({ IDL }) => {
  const Product = IDL.Record({
    'id' : IDL.Text,
    'imagePath' : IDL.Text,
    'inventory' : IDL.Nat,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'sizes' : IDL.Vec(IDL.Text),
    'colors' : IDL.Vec(IDL.Text),
    'price' : IDL.Nat,
  });
  const CartItem = IDL.Record({
    'size' : IDL.Text,
    'productId' : IDL.Text,
    'quantity' : IDL.Nat,
  });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const ShoppingItem = IDL.Record({
    'productName' : IDL.Text,
    'currency' : IDL.Text,
    'quantity' : IDL.Nat,
    'priceInCents' : IDL.Nat,
    'productDescription' : IDL.Text,
  });
  const UserProfile = IDL.Record({ 'name' : IDL.Text, 'email' : IDL.Text });
  const Cart = IDL.Record({ 'total' : IDL.Nat, 'items' : IDL.Vec(CartItem) });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const Order = IDL.Record({
    'id' : IDL.Text,
    'customerName' : IDL.Text,
    'status' : IDL.Text,
    'total' : IDL.Nat,
    'email' : IDL.Text,
    'timestamp' : IDL.Int,
    'shippingAddress' : IDL.Text,
    'items' : IDL.Vec(CartItem),
  });
  const StripeSessionStatus = IDL.Variant({
    'completed' : IDL.Record({
      'userPrincipal' : IDL.Opt(IDL.Text),
      'response' : IDL.Text,
    }),
    'failed' : IDL.Record({ 'error' : IDL.Text }),
  });
  const StripeConfiguration = IDL.Record({
    'allowedCountries' : IDL.Vec(IDL.Text),
    'secretKey' : IDL.Text,
  });
  const http_header = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const http_request_result = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(http_header),
  });
  const TransformationInput = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : http_request_result,
  });
  const TransformationOutput = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(http_header),
  });
  return IDL.Service({
    'addProduct' : IDL.Func([Product], [], []),
    'addToCart' : IDL.Func([CartItem], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'clearCart' : IDL.Func([], [], []),
    'createCheckoutSession' : IDL.Func(
        [IDL.Vec(ShoppingItem), IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
    'deleteProduct' : IDL.Func([IDL.Text], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getCart' : IDL.Func([], [IDL.Opt(Cart)], ['query']),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getOrder' : IDL.Func([IDL.Text], [IDL.Opt(Order)], ['query']),
    'getOrders' : IDL.Func([], [IDL.Vec(Order)], ['query']),
    'getProduct' : IDL.Func([IDL.Text], [IDL.Opt(Product)], ['query']),
    'getProducts' : IDL.Func([], [IDL.Vec(Product)], ['query']),
    'getStripeSessionStatus' : IDL.Func([IDL.Text], [StripeSessionStatus], []),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isStripeConfigured' : IDL.Func([], [IDL.Bool], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'placeOrder' : IDL.Func([Order], [], []),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'setStripeConfiguration' : IDL.Func([StripeConfiguration], [], []),
    'transform' : IDL.Func(
        [TransformationInput],
        [TransformationOutput],
        ['query'],
      ),
    'updateCart' : IDL.Func([IDL.Vec(CartItem)], [], []),
    'updateOrder' : IDL.Func([Order], [], []),
    'updateProduct' : IDL.Func([Product], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
