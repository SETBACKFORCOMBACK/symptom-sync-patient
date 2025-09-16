import * as React from "react";
import { cn } from "@/lib/utils";

export interface MedicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "outlined";
  children: React.ReactNode;
}

const MedicalCard = React.forwardRef<HTMLDivElement, MedicalCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const baseClasses = "rounded-xl p-6 healthcare-transition";
    
    const variantClasses = {
      default: "bg-card text-card-foreground healthcare-shadow border border-border",
      gradient: "healthcare-gradient text-foreground healthcare-shadow-medium border border-border/50",
      outlined: "bg-card/50 text-card-foreground border-2 border-primary/20 hover:border-primary/40 healthcare-transition"
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MedicalCard.displayName = "MedicalCard";

export { MedicalCard };