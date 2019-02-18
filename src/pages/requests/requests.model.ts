/*IMPLEMENT REALTIME SNAPSHOT */

type BidInfo = {
  createdAtString: string;
  deliveryDate: string;
  email: string;
  id: string;
  phoneNumber: string;
  price: number;
  status: string;
  taxOffice: string;
  userAddress: string;
  userCompany: string;
  userId: string;
  userName: string;
  userSurname: string;
  userVatNumber: string;
};

export interface ProductRequest {
  id: string;
  userId: string /* The retailer id */;
  status: string;
  amount: string;
  createdAt: string;
  productBarcode: string;

  bids?: Map<string, Map<string, any>>;
  acceptedBid?: Map<string, any>;
}
