
export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  STUDIO = 'STUDIO',
  CONDO = 'CONDO',
  ROOM = 'ROOM'
}
export const ALLOWED_PROPERTY_TYPES = [
  PropertyType.APARTMENT,
  PropertyType.HOUSE,
  PropertyType.STUDIO,
  PropertyType.CONDO,
  PropertyType.ROOM
];

export interface ICreatePropertyPayload {
  type: PropertyType;
  price: number;
  title: string;
  description: string;
  location?: string | null;
  amenities?: string[];
}