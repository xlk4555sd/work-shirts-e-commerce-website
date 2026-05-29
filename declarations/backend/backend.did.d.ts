import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Cart { 'total' : bigint, 'items' : Array<CartItem> }
export interface CartItem {
  'size' : string,
  'productId' : string,
  'quantity' : bigint,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface Order {
  'id' : string,
  'customerName' : string,
  'status' : string,
  'total' : bigint,
  'email' : string,
  'timestamp' : bigint,
  'shippingAddress' : string,
  'items' : Array<CartItem>,
}
export interface Product {
  'id' : string,
  'imagePath' : string,
  'inventory' : bigint,
  'name' : string,
  'description' : string,
  'sizes' : Array<string>,
  'colors' : Array<string>,
  'price' : bigint,
}
export interface ShoppingItem {
  'productName' : string,
  'currency' : string,
  'quantity' : bigint,
  'priceInCents' : bigint,
  'productDescription' : string,
}
export interface StripeConfiguration {
  'allowedCountries' : Array<string>,
  'secretKey' : string,
}
export type StripeSessionStatus = {
    'completed' : { 'userPrincipal' : [] | [string], 'response' : string }
  } |
  { 'failed' : { 'error' : string } };
export interface TransformationInput {
  'context' : Uint8Array | number[],
  'response' : http_request_result,
}
export interface TransformationOutput {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<http_header>,
}
export interface UserProfile { 'name' : string, 'email' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface http_header { 'value' : string, 'name' : string }
export interface http_request_result {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<http_header>,
}
export interface _SERVICE {
  'addProduct' : ActorMethod<[Product], undefined>,
  'addToCart' : ActorMethod<[CartItem], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'clearCart' : ActorMethod<[], undefined>,
  'createCheckoutSession' : ActorMethod<
    [Array<ShoppingItem>, string, string],
    string
  >,
  'deleteProduct' : ActorMethod<[string], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getCart' : ActorMethod<[], [] | [Cart]>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getOrder' : ActorMethod<[string], [] | [Order]>,
  'getOrders' : ActorMethod<[], Array<Order>>,
  'getProduct' : ActorMethod<[string], [] | [Product]>,
  'getProducts' : ActorMethod<[], Array<Product>>,
  'getStripeSessionStatus' : ActorMethod<[string], StripeSessionStatus>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'isStripeConfigured' : ActorMethod<[], boolean>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'placeOrder' : ActorMethod<[Order], undefined>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'setStripeConfiguration' : ActorMethod<[StripeConfiguration], undefined>,
  'transform' : ActorMethod<[TransformationInput], TransformationOutput>,
  'updateCart' : ActorMethod<[Array<CartItem>], undefined>,
  'updateOrder' : ActorMethod<[Order], undefined>,
  'updateProduct' : ActorMethod<[Product], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
