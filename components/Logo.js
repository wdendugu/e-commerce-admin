import { MainIcon } from "@/utils/Icons"

export default function Logo () {
    return (
        <a className="flex gap-1">
            <MainIcon/>
            <span className="">
                EcommerceAdmin
            </span>
        </a>
    )
}