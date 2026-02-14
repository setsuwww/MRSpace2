"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ============================= */
/* TABLE WRAPPER */
/* ============================= */

function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table
        className={cn("w-full text-sm text-gray-700", className)}
        {...props}
      />
    </div>
  )
}

/* ============================= */
/* HEADER */
/* ============================= */

function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn("bg-gray-50 border-b border-gray-200", className)}
      {...props}
    />
  )
}

/* ============================= */
/* BODY */
/* ============================= */

function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn("", className)}
      {...props}
    />
  )
}

/* ============================= */
/* FOOTER */
/* ============================= */

function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn("bg-gray-50 border-t border-gray-200 font-medium", className)}
      {...props}
    />
  )
}

/* ============================= */
/* ROW */
/* ============================= */

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150",
        className
      )}
      {...props}
    />
  )
}

/* ============================= */
/* HEAD CELL */
/* ============================= */

function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide",
        className
      )}
      {...props}
    />
  )
}

/* ============================= */
/* CELL */
/* ============================= */

function TableCell({ className, ...props }) {
  return (
    <td
      className={cn(
        "px-6 py-4 align-middle text-gray-800",
        className
      )}
      {...props}
    />
  )
}

/* ============================= */
/* CAPTION */
/* ============================= */

function TableCaption({ className, ...props }) {
  return (
    <caption
      className={cn("mt-4 text-sm text-gray-500", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
