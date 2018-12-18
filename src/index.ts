import { ITranslator, TransOptions, ValueMap } from 'inno-trans/lib/types'
import { cloneElement, createElement, Fragment, ReactElement, ReactNode } from 'react'
import parseTag from 'tag-name-parser'

type TagNode = ReturnType<typeof parseTag>[number]

declare module 'inno-trans/lib/types' {
    interface ITranslator {
        rt (key: string, values: ValueMap, opts?: TransOptions): ReactElement<any>
        rtc (key: string, num: number, values: ValueMap, opts?: TransOptions): ReactElement<any>
    }
}

export = (trans: ITranslator): ITranslator => {
    trans.rt = reactTrans
    trans.rtc = reactTranceChoice
    return trans
}

function reactTrans (this: ITranslator, key: string, values: ValueMap, opts?: TransOptions) {
    return strToReactElement(this.trans(key, values, opts), values)
}

function reactTranceChoice (this: ITranslator, key: string, num: number, values: ValueMap, opts?: TransOptions) {
    return strToReactElement(this.transChoice(key, num, values, opts), values)
}

function strToReactElement (str: string, values: ValueMap) {
    return createElement(Fragment, undefined, ...nodesToReactNodes(parseTag(str), values))
}

function nodesToReactNodes (nodes: TagNode[], values: ValueMap): ReactNode[] {
    return nodes.map(node => nodeToReactNode(node, values))
}

function nodeToReactNode (node: TagNode, values: ValueMap): ReactNode {
    if (typeof node === 'string') return node
    if (node.single) return values[node.name]
    return cloneElement(values[node.name], undefined, ...nodesToReactNodes(node.children, values))
}
