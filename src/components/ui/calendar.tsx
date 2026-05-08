"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={ptBR}
      className={cn("p-3", className)}
      classNames={{
        [UI.Root]: "relative",
        [UI.Months]: "flex flex-col",
        [UI.Month]: "space-y-3",
        [UI.MonthCaption]: "flex items-center justify-between px-1",
        [UI.CaptionLabel]: "text-sm font-bold text-foreground",
        [UI.Nav]: "flex items-center gap-1",
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 rounded-lg hover:bg-secondary"
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 rounded-lg hover:bg-secondary"
        ),
        [UI.MonthGrid]: "w-full border-collapse",
        [UI.Weekdays]: "flex w-full",
        [UI.Weekday]: "w-9 text-center text-[10px] font-semibold text-muted-foreground",
        [UI.Weeks]: "flex flex-col",
        [UI.Week]: "flex w-full mt-2",
        [UI.Day]: "h-9 w-9 p-0 text-center",
        [UI.DayButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium rounded-full hover:bg-secondary"
        ),
        [SelectionState.selected]:
          "bg-primary rounded-full text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        [DayFlag.today]: "bg-primary/10 text-primary",
        [DayFlag.outside]: "text-muted-foreground opacity-50",
        [DayFlag.disabled]: "text-muted-foreground opacity-50",
        [DayFlag.hidden]: "invisible",
        [SelectionState.range_middle]: "bg-secondary",
        [SelectionState.range_start]: "bg-primary text-primary-foreground",
        [SelectionState.range_end]: "bg-primary text-primary-foreground",
      }}
      formatters={{
        formatWeekdayName: (weekday) => {
          const labels = ["D", "S", "T", "Q", "Q", "S", "S"]
          return labels[weekday.getDay()] ?? ""
        },
      }}
      components={{
        Chevron: (p) =>
          p.orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
