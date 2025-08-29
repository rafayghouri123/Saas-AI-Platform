import { Doc } from "@@workspace/backend/_generated/dataModel";
import { STATUS_FILTER_KEY } from "../modules/dashboard/constant";
import {atomWithStorage} from "jotai/utils"


export const statusFilterAtom = atomWithStorage<Doc<"conversations">["status"]|"all">(STATUS_FILTER_KEY,"all")