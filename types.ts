// Fix: Add optional `sources` property to store grounding metadata from Google Search.
export interface ProductInfo {
  title: string;
  price: string;
  availability: string;
  imageUrl: string;
  sources?: { uri: string, title: string }[];
}
