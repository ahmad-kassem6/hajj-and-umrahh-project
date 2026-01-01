import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

export function ContactModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-lg font-semibold">
            Islamic Travel and Cultural LLC
          </p>
          <p>10400 Eaton Place Fairfax</p>
          <p>Virginia, USA</p>
          <p>Tel: +1 (703) 586-5240</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
