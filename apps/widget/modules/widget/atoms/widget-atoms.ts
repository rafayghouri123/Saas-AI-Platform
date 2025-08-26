import { WidgetScreen } from "@/types";
import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { CONTACT_SESSION_KEY } from "../constant";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
export const screenAtom = atom<WidgetScreen>("loading")


export const errorMessageAtom=atom<string|null>(null)

export const loadingMessageAtom=atom<string|null>(null)

export const contactSessionIdAtomFamily = atomFamily((organizationId:string)=>atomWithStorage<Id<"contactSessions">|null>(`${CONTACT_SESSION_KEY}_${organizationId}`,null))


export const organizationIdAtom = atom<string|null>(null)