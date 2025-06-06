export type CategoryType = {
  _id: string;
  name: string;
  parentCategory: string;
  description: string;
  type: EnumTag;
  children?: CategoryType[];
};
export enum EnumTag {
  TYPE_PROBLEM = 'Problem',
  TYPE_POST = 'Post'
}
