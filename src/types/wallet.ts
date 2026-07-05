export type WalletRole = "OWNER" | "EDITOR" | "VIEWER";

export interface Wallet {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  /** The requesting user's role in this wallet. */
  role: WalletRole;
  ownerName: string;
}

export interface WalletMember {
  userId: number;
  name: string;
  email: string;
  role: WalletRole;
  joinedAt: string;
}
