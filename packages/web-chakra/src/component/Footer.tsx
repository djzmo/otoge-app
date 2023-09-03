import { Box, BoxProps, Link, Text } from "@chakra-ui/react"
import { AiFillGithub, AiFillHeart } from "react-icons/all"
import * as React from "react"

export default function Footer(props: BoxProps) {
  return (
    <Box mt="auto" alignItems="end" p="4" {...props}>
      <Text textAlign="center" color="gray">
        made with{" "}
        <AiFillHeart
          style={{ display: "inline-block", verticalAlign: "middle" }}
          color="pink"
        />{" "}
        by{" "}
        <Link
          href="https://github.com/djzmo/otoge.app"
          target="_blank"
          fontWeight="bold"
        >
          <AiFillGithub
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />{" "}
          djzmo
        </Link>
      </Text>
    </Box>
  )
}
