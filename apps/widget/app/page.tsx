import { Button } from "@workspace/ui/components/button"
import { add } from "../../../packages/math/src/add"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World/ Widget</h1>
        <Button size="sm">Button</Button>
        <h2>{add(2,2)}</h2>
      </div>
    </div>
  )
}
