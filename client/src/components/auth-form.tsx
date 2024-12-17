import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
}

export function AuthForm({ 
  title, 
  description, 
  children, 
  onSubmit,
  className,
  ...props 
}: AuthFormProps) {
  return (
    <div className="relative">
      <Card className={cn(
        "w-[400px] bg-black border-neutral-800",
        className
      )} {...props}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium">{title}</CardTitle>
          {description && 
            <CardDescription className="text-neutral-400">
              {description}
            </CardDescription>
          }
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function AuthInput({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm text-neutral-400">
        {label}
      </Label>
      <Input 
        {...props} 
        className={cn(
          "bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500",
          "focus:border-neutral-700 focus:ring-neutral-700",
          props.className
        )} 
      />
    </div>
  )
}

export function AuthButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button 
      {...props} 
      className={cn(
        "w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-medium",
        "transition-all duration-200",
        props.className
      )}
    />
  )
}

export function AuthLink(props: React.ComponentProps<"a">) {
  return (
    <a 
      {...props} 
      className={cn(
        "text-[#FFD700] hover:text-[#FFD700]/90 transition-colors duration-200",
        props.className
      )}
    />
  )
}
