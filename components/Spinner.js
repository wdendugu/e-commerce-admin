import {FadeLoader} from "react-spinners"

export function Spinner () {
    return (
        <FadeLoader color={'#4162e7'} />
    )
}

export function SpinnerTable ({col}) {
    return (
        <tr className="text-center">
            <td colSpan={col}>
                <div className="flex justify-center items-center py-4">
                    <Spinner />
                </div>
            </td>
        </tr>
    )
}

export function SpinnerCenter () {
    return (
        <div className="flex justify-center items-center py-4">
            <Spinner />
        </div>
    )
}