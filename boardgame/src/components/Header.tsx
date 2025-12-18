import { Link } from '@tanstack/react-router'

import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  return (
    <>
    </>
  )
}
