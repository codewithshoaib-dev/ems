
import { cn } from "../utils";

export function Card({ className, children }) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-md", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
