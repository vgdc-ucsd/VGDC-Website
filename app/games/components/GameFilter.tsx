"use client"

import { ChangeEventHandler } from "react"

export type GameFilterProps = {
  name: string,
  onChange: ChangeEventHandler<HTMLSelectElement>,
  filterValue: any
  options: {
    value: string,
    text: string,
  }[]
}

export default function GameFilter(props: GameFilterProps) {
  return <div>
    <label className="mb-1 block text-sm font-medium text-gray-300">
      {props.name}
    </label>
    <select
      className="w-full rounded-md border border-background-grey bg-background-black p-2 text-white focus:outline-none"
      value={props.filterValue}
      onChange={props.onChange}
    >
      <option value="all">Any</option>
      {props.options.map((option) => (
        <option value={option.value}>{option.text}</option>
      ))}
    </select>
  </div>
}
