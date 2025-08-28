import { IndentDtlTable } from '../../types/invoiceReceipt';
import { convertToFarsiDigits, convertToLatinDigits, formatNumberWithCommas } from '../../utilities/general'

type Props = {
    data: IndentDtlTable[];
}

const InvoiceReceiptShowTableSummery = ({data}: Props) => {
  return (
    <div className="flex justify-evenly items-center text-gray-500 text-sm w-full">
    <p>
      تعداد:{" "}
      {convertToFarsiDigits(
        data.reduce(
          (acc, row) =>
            acc + Number(convertToLatinDigits(row.cnt.toString())),
          0
        )
      )}
    </p>
    <p>
      آفر:{" "}
      {convertToFarsiDigits(
        data.reduce(
          (acc, row) =>
            acc + Number(convertToLatinDigits(row.offer.toString())),
          0
        )
      )}
    </p>
    <p>
      مالیات:{" "}
      {convertToFarsiDigits(
        formatNumberWithCommas(
          data.reduce((acc, row) => acc + row.taxValue, 0)
        )
      )}
    </p>
    <p>
      تخفیف:{" "}
      {convertToFarsiDigits(
        formatNumberWithCommas(
          data.reduce(
            (acc, row) =>
              acc + Number(convertToLatinDigits(row.dcrmnt.toString())),
            0
          )
        )
      )}
    </p>
    <p>
      جمع:{" "}
      {convertToFarsiDigits(
        formatNumberWithCommas(
          data.reduce((acc, row) => acc + row.total, 0)
        )
      )}
    </p>
  </div>
  )
}

export default InvoiceReceiptShowTableSummery