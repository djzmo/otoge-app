interface AllNetContextInfo {
  allNetCt?: string
  allNetAt?: string
  allNetSid?: string
  allNetGm?: string
}

interface EAmusementContextInfo {
  eAmusementFdesc?: string
}

interface ContextInfo extends AllNetContextInfo, EAmusementContextInfo {}
export default ContextInfo
