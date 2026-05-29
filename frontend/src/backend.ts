import { type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { backend as _backend, createActor as _createActor, canisterId as _canisterId, CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> {
    return {
        __kind__: "Some",
        value: value
    };
}
function none(): None {
    return {
        __kind__: "None"
    };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) {
        throw new Error("unwrap: none");
    }
    return option.value;
}
function candid_some<T>(value: T): [T] {
    return [
        value
    ];
}
function candid_none<T>(): [] {
    return [];
}
function record_opt_to_undefined<T>(arg: T | null): T | undefined {
    return arg == null ? undefined : arg;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array | number[];
    headers: Array<http_header>;
}
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface FileReference {
    hash: string;
    path: string;
}
export interface Cart {
    total: bigint;
    items: Array<CartItem>;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface Order {
    id: string;
    customerName: string;
    status: string;
    total: bigint;
    email: string;
    timestamp: bigint;
    shippingAddress: string;
    items: Array<CartItem>;
}
export interface Product {
    id: string;
    imagePath: string;
    inventory: bigint;
    name: string;
    description: string;
    sizes: Array<string>;
    colors: Array<string>;
    price: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array | number[];
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array | number[];
    response: http_request_result;
}
export interface CartItem {
    size: string;
    productId: string;
    quantity: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export function createActor(canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never): backendInterface {
    const actor = _createActor(canisterId, options);
    return new Backend(actor, processError);
}
export const canisterId = _canisterId;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(item: CartItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteProduct(productId: string): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart | null>;
    getFileReference(path: string): Promise<FileReference>;
    getOrder(orderId: string): Promise<Order | null>;
    getOrders(): Promise<Array<Order>>;
    getProduct(productId: string): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listFileReferences(): Promise<Array<FileReference>>;
    placeOrder(order: Order): Promise<void>;
    registerFileReference(path: string, hash: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCart(items: Array<CartItem>): Promise<void>;
    updateOrder(order: Order): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
import type { Cart as _Cart, Order as _Order, Product as _Product, StripeSessionStatus as _StripeSessionStatus, UserProfile as _UserProfile, UserRole as _UserRole } from "declarations/backend/backend.did.d.ts";
class Backend implements backendInterface {
    private actor: ActorSubclass<_SERVICE>;
    constructor(actor?: ActorSubclass<_SERVICE>, private processError?: (error: unknown) => never){
        this.actor = actor ?? _backend;
    }
    async addProduct(arg0: Product): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addProduct(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addProduct(arg0);
            return result;
        }
    }
    async addToCart(arg0: CartItem): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addToCart(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addToCart(arg0);
            return result;
        }
    }
    async assignCallerUserRole(arg0: Principal, arg1: UserRole): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n1(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n1(arg1));
            return result;
        }
    }
    async clearCart(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.clearCart();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.clearCart();
            return result;
        }
    }
    async createCheckoutSession(arg0: Array<ShoppingItem>, arg1: string, arg2: string): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
            return result;
        }
    }
    async deleteProduct(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteProduct(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteProduct(arg0);
            return result;
        }
    }
    async dropFileReference(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.dropFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.dropFileReference(arg0);
            return result;
        }
    }
    async getCallerUserProfile(): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserProfile();
                return from_candid_opt_n3(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserProfile();
            return from_candid_opt_n3(result);
        }
    }
    async getCallerUserRole(): Promise<UserRole> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserRole();
                return from_candid_UserRole_n4(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserRole();
            return from_candid_UserRole_n4(result);
        }
    }
    async getCart(): Promise<Cart | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getCart();
                return from_candid_opt_n6(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCart();
            return from_candid_opt_n6(result);
        }
    }
    async getFileReference(arg0: string): Promise<FileReference> {
        if (this.processError) {
            try {
                const result = await this.actor.getFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getFileReference(arg0);
            return result;
        }
    }
    async getOrder(arg0: string): Promise<Order | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getOrder(arg0);
                return from_candid_opt_n7(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getOrder(arg0);
            return from_candid_opt_n7(result);
        }
    }
    async getOrders(): Promise<Array<Order>> {
        if (this.processError) {
            try {
                const result = await this.actor.getOrders();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getOrders();
            return result;
        }
    }
    async getProduct(arg0: string): Promise<Product | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getProduct(arg0);
                return from_candid_opt_n8(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getProduct(arg0);
            return from_candid_opt_n8(result);
        }
    }
    async getProducts(): Promise<Array<Product>> {
        if (this.processError) {
            try {
                const result = await this.actor.getProducts();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getProducts();
            return result;
        }
    }
    async getStripeSessionStatus(arg0: string): Promise<StripeSessionStatus> {
        if (this.processError) {
            try {
                const result = await this.actor.getStripeSessionStatus(arg0);
                return from_candid_StripeSessionStatus_n9(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getStripeSessionStatus(arg0);
            return from_candid_StripeSessionStatus_n9(result);
        }
    }
    async getUserProfile(arg0: Principal): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getUserProfile(arg0);
                return from_candid_opt_n3(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getUserProfile(arg0);
            return from_candid_opt_n3(result);
        }
    }
    async initializeAccessControl(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.initializeAccessControl();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.initializeAccessControl();
            return result;
        }
    }
    async isCallerAdmin(): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.isCallerAdmin();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.isCallerAdmin();
            return result;
        }
    }
    async isStripeConfigured(): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.isStripeConfigured();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.isStripeConfigured();
            return result;
        }
    }
    async listFileReferences(): Promise<Array<FileReference>> {
        if (this.processError) {
            try {
                const result = await this.actor.listFileReferences();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.listFileReferences();
            return result;
        }
    }
    async placeOrder(arg0: Order): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.placeOrder(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.placeOrder(arg0);
            return result;
        }
    }
    async registerFileReference(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.registerFileReference(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.registerFileReference(arg0, arg1);
            return result;
        }
    }
    async saveCallerUserProfile(arg0: UserProfile): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.saveCallerUserProfile(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.saveCallerUserProfile(arg0);
            return result;
        }
    }
    async setStripeConfiguration(arg0: StripeConfiguration): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.setStripeConfiguration(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.setStripeConfiguration(arg0);
            return result;
        }
    }
    async transform(arg0: TransformationInput): Promise<TransformationOutput> {
        if (this.processError) {
            try {
                const result = await this.actor.transform(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.transform(arg0);
            return result;
        }
    }
    async updateCart(arg0: Array<CartItem>): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateCart(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateCart(arg0);
            return result;
        }
    }
    async updateOrder(arg0: Order): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateOrder(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateOrder(arg0);
            return result;
        }
    }
    async updateProduct(arg0: Product): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateProduct(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateProduct(arg0);
            return result;
        }
    }
}
export const backend: backendInterface = new Backend();
function from_candid_StripeSessionStatus_n9(value: _StripeSessionStatus): StripeSessionStatus {
    return from_candid_variant_n10(value);
}
function from_candid_UserRole_n4(value: _UserRole): UserRole {
    return from_candid_variant_n5(value);
}
function from_candid_opt_n12(value: [] | [string]): string | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n3(value: [] | [_UserProfile]): UserProfile | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n6(value: [] | [_Cart]): Cart | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(value: [] | [_Order]): Order | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n8(value: [] | [_Product]): Product | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_record_n11(value: {
    userPrincipal: [] | [string];
    response: string;
}): {
    userPrincipal?: string;
    response: string;
} {
    return {
        userPrincipal: record_opt_to_undefined(from_candid_opt_n12(value.userPrincipal)),
        response: value.response
    };
}
function from_candid_variant_n10(value: {
    completed: {
        userPrincipal: [] | [string];
        response: string;
    };
} | {
    failed: {
        error: string;
    };
}): {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
} {
    return "completed" in value ? {
        __kind__: "completed",
        completed: from_candid_record_n11(value.completed)
    } : "failed" in value ? {
        __kind__: "failed",
        failed: value.failed
    } : value;
}
function from_candid_variant_n5(value: {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
}): UserRole {
    return "admin" in value ? UserRole.admin : "user" in value ? UserRole.user : "guest" in value ? UserRole.guest : value;
}
function to_candid_UserRole_n1(value: UserRole): _UserRole {
    return to_candid_variant_n2(value);
}
function to_candid_variant_n2(value: UserRole): {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
} {
    return value == UserRole.admin ? {
        admin: null
    } : value == UserRole.user ? {
        user: null
    } : value == UserRole.guest ? {
        guest: null
    } : value;
}

