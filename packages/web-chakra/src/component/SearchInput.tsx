import * as React from "react"
import {
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react"
import { Search2Icon } from "@chakra-ui/icons"
import { KeyboardEvent, useState } from "react"

interface SearchInputProps extends InputProps {
  onSearch: (query: string) => void
}

export default function SearchInput({ onSearch, ...props }: SearchInputProps) {
  const [query, setQuery] = useState("")
  const handleClick = () => {
    onSearch(query)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(query)
    }
  }

  return (
    <InputGroup size="lg">
      <Input
        pr="4.5rem"
        placeholder="Search location"
        onInput={e => setQuery(e.currentTarget.value)}
        onKeyPress={handleKeyPress}
        autoFocus={true}
        {...props}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={handleClick}
          isDisabled={props.isReadOnly}
        >
          <Search2Icon />
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
