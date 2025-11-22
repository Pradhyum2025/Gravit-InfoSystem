import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const SheetContext = React.createContext({})

const Sheet = ({ children, open, onOpenChange }) => {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            <AnimatePresence>{open && children}</AnimatePresence>
        </SheetContext.Provider>
    )
}

const SheetTrigger = ({ children, asChild }) => {
    const { onOpenChange } = React.useContext(SheetContext)
    return React.cloneElement(children, {
        onClick: () => onOpenChange(true),
    })
}

const SheetContent = ({ children, side = "left", className }) => {
    const { onOpenChange } = React.useContext(SheetContext)

    const variants = {
        left: { x: "-100%" },
        right: { x: "100%" },
        top: { y: "-100%" },
        bottom: { y: "100%" },
    }

    const animate = {
        left: { x: 0 },
        right: { x: 0 },
        top: { y: 0 },
        bottom: { y: 0 },
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />
            <motion.div
                initial={variants[side]}
                animate={animate[side]}
                exit={variants[side]}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={cn(
                    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                    {
                        "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm": side === "left",
                        "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm": side === "right",
                    },
                    className
                )}
            >
                <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4 cursor-pointer" onClick={() => onOpenChange(false)} />
                    <span className="sr-only">Close</span>
                </div>
                {children}
            </motion.div>
        </>
    )
}

const SheetHeader = ({ className, ...props }) => (
    <div
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
        {...props}
    />
)

const SheetTitle = ({ className, ...props }) => (
    <h3
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
)

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }
