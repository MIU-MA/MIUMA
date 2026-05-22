const pickExport = (mod, exportName, componentName, path) => {
  const resolved = exportName === 'default' ? mod?.default : mod?.[exportName]
  if (!resolved) {
    throw new Error(`[nuxt-content] Missing export "${exportName}" for component "${componentName}" in "${path}".`)
  }
  return resolved
}
export const localComponentLoaders = {
}
export const globalComponents: string[] = ["ProseA","ProseBlockquote","ProseCode","ProseEm","ProseH1","ProseH2","ProseH3","ProseH4","ProseH5","ProseH6","ProseHr","ProseImg","ProseLi","ProseOl","ProseP","ProsePre","ProseScript","ProseStrong","ProseTable","ProseTbody","ProseTd","ProseTh","ProseThead","ProseTr","ProseUl"]
export const localComponents: string[] = []