import { type HttpAgentOptions, type ActorConfig, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export declare const createActor: (canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never) => backendInterface;
export declare const canisterId: string;
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

