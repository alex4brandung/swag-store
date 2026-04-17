export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  featured: boolean;
  tags: string[];
  createdAt: string;
};

export type StockInfo = {
  productId: string;
  stock: number;
  inStock: boolean;
  lowStock: boolean;
};

export type Category = {
  slug: string;
  name: string;
  productCount: number;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
};

export type CartItemWithProduct = {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
  lineTotal: number;
};

export type CartWithProducts = {
  token: string;
  items: CartItemWithProduct[];
  totalItems: number;
  subtotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
