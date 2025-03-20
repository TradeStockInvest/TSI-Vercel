import { LockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ProFeatureLockProps {
  featureName: string
  description?: string
}

export function ProFeatureLock({ featureName, description }: ProFeatureLockProps) {
  return (
    <Card className="w-full border-dashed border-yellow-500/50 bg-yellow-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-yellow-500">
          <LockIcon className="mr-2 h-4 w-4" />
          {featureName} - PRO Feature
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>This feature is only available with the PRO plan subscription.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Upgrade to PRO
        </Button>
      </CardFooter>
    </Card>
  )
}

