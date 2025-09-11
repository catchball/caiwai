import { Clipping } from "@catchball/tansaku-client/lib"

export const groupScore = (group: Clipping[]) =>
  group.reduce((p, c) => p + c.score, 0) + group.length - 1

export const clippingGroupSortFunc = (a: Clipping[], b: Clipping[]) =>
  groupScore(b) - groupScore(a)
