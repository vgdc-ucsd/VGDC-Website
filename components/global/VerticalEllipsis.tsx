import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { IoCreate, IoEllipsisVertical, IoTrash } from "react-icons/io5"

type VerticalEllipsisProps = {
  onUpdate: () => void
  onDelete: () => void
}

export default function VerticalEllipsis({ onUpdate, onDelete }: VerticalEllipsisProps) {
  return (
    // Prevent clicks on the menu trigger from following the card's link
    <div className="absolute bottom-1 right-1 text-right" onClick={e => { e.preventDefault(); e.stopPropagation() }}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <IoEllipsisVertical size={20} className="text-white hover:text-light-grey" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent onClick={e => e.stopPropagation()} onCloseAutoFocus={e => e.preventDefault()} className="bg-background-grey border-none">
            <DropdownMenuItem onSelect={() => onUpdate()} className="hover:cursor-pointer text-white">
              Update
              <IoCreate className="ml-auto relative -top-1/2" />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete()} className="text-red-500 hover:cursor-pointer">
              Delete
              <IoTrash className="ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
}
