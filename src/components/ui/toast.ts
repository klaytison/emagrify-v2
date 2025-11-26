"use client"

import * as React from "react"
import { ToastProvider as RadixToastProvider } from "@radix-ui/react-toast"
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "./toast"

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RadixToastProvider swipeDirection="right">
      {children}
      <ToastViewport />
    </RadixToastProvider>
  )
}

export { Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport }
