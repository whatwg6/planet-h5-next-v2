import type { ComponentType, SVGProps } from "react";
import {
  AccountIconShape,
  AccountTabIconShape,
  AnnouncementHandleIconShape,
  AnnouncementIconShape,
  AnnouncementStemIconShape,
  CostCenterIconShape,
  DepartmentIconShape,
  FaceEyeIconShape,
  FaceIconShape,
  FaceMouthIconShape,
  FaceNoseIconShape,
  FieldIconShape,
  GroupCircleIconShape,
  KeyholeIconShape,
  LinkIconShape,
  LinkLineIconShape,
  MailIconShape,
  MealCardIconShape,
  MealCardLongLineIconShape,
  MealCardShortLineIconShape,
  MealsIconShape,
  NoteIconShape,
  NotePencilIconShape,
  PaymentCardBodyIconShape,
  PaymentCardTopIconShape,
  SupportIconShape,
  UserIconShape,
  VersionsIconShape,
} from "@/shared/assets/icons";

export type SettingsIconName =
  | "account"
  | "announcement"
  | "cost-center"
  | "department"
  | "face"
  | "field"
  | "group"
  | "keyhole"
  | "link"
  | "mail"
  | "meal-card"
  | "meals"
  | "note"
  | "payment-card"
  | "support"
  | "user"
  | "versions";

const singleShapeIcons: Partial<Record<SettingsIconName, ComponentType<SVGProps<SVGSVGElement>>>> =
  {
    "cost-center": CostCenterIconShape,
    department: DepartmentIconShape,
    field: FieldIconShape,
    keyhole: KeyholeIconShape,
    mail: MailIconShape,
    meals: MealsIconShape,
    support: SupportIconShape,
    user: UserIconShape,
    versions: VersionsIconShape,
  };

export function SettingsIcon({ name }: { name: SettingsIconName }) {
  const SingleShape = singleShapeIcons[name];
  if (SingleShape) {
    return <SingleShape aria-hidden className="size-6 p-[2px] text-content-primary" />;
  }

  return (
    <span aria-hidden className="relative block size-6 shrink-0 text-content-primary">
      {name === "note" && (
        <>
          <NoteIconShape className="absolute left-[3px] top-[3px] h-[18px] w-4" />
          <NotePencilIconShape className="absolute left-[15px] top-[6px] h-[12px] w-0.5 rotate-45" />
        </>
      )}
      {name === "announcement" && (
        <>
          <AnnouncementIconShape className="absolute left-2 top-[3px] h-[18px] w-3" />
          <AnnouncementHandleIconShape className="absolute left-[3px] top-[7px] h-2.5 w-[3px]" />
          <AnnouncementStemIconShape className="absolute left-1.5 top-[18px] h-1 w-[3px]" />
        </>
      )}
      {name === "meal-card" && (
        <>
          <MealCardShortLineIconShape className="absolute left-[5px] top-1 h-0.5 w-3.5" />
          <MealCardLongLineIconShape className="absolute left-1 top-[7px] h-0.5 w-4" />
          <MealCardIconShape className="absolute left-[3px] top-[11px] h-[9px] w-[18px]" />
        </>
      )}
      {name === "group" && (
        <>
          <GroupCircleIconShape className="absolute left-2 top-[3px] size-2" />
          <GroupCircleIconShape className="absolute left-0.5 top-[13px] size-2" />
          <GroupCircleIconShape className="absolute left-3.5 top-[13px] size-2" />
        </>
      )}
      {name === "account" && (
        <>
          <AccountIconShape className="absolute left-[3px] top-1.5 h-3.5 w-[18px]" />
          <AccountTabIconShape className="absolute left-2.5 top-0.5 h-[3px] w-[3px]" />
        </>
      )}
      {name === "payment-card" && (
        <>
          <PaymentCardTopIconShape className="absolute left-[3px] top-1 h-[3px] w-[18px]" />
          <PaymentCardBodyIconShape className="absolute left-[3px] top-[9px] h-2.5 w-[18px]" />
        </>
      )}
      {name === "link" && (
        <>
          <LinkIconShape className="absolute left-[4px] top-[4px] h-[7px] w-2.5 -rotate-45" />
          <LinkIconShape className="absolute left-[11px] top-[11px] h-[7px] w-2.5 rotate-[135deg]" />
          <LinkLineIconShape className="absolute left-[8px] top-[11px] h-0.5 w-2 rotate-45" />
        </>
      )}
      {name === "face" && (
        <>
          <FaceIconShape className="absolute left-[3px] top-[3px] size-[18px]" />
          <FaceNoseIconShape className="absolute left-[10px] top-2 h-[5px] w-[3px]" />
          <FaceEyeIconShape className="absolute left-[7px] top-2 h-[3px] w-0.5" />
          <FaceEyeIconShape className="absolute left-[15px] top-2 h-[3px] w-0.5" />
          <FaceMouthIconShape className="absolute left-[9px] top-[15px] h-[3px] w-[7px]" />
        </>
      )}
    </span>
  );
}
