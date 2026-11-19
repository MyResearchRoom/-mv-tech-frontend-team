
const TableComponent = ({
  columns = [],
  data = [],
  actions,
  actionLabel = "Actions",
  headerBg = "bg-[#f3f0f7]",
  onClick,
  loading = false,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full table-fixed bg-white border-collapse">

        {/* Table Header */}
        <thead className={` ${headerBg}`}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`
                  px-2 py-2
                  text-sm font-semibold
                  text-center align-middle
                  text-gray-700
                  border-b border-gray-200
                  overflow-hidden text-ellipsis
                  whitespace-nowrap
                  ${col.headerClassName || ""}
                `}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}

            {actions && (
              <th className="
                px-2 py-2
                text-sm font-semibold
                text-center
                text-gray-700
                border-b border-gray-200
                whitespace-nowrap
              ">
                {actionLabel}
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="h-14 border-b border-gray-100 animate-pulse"
              >
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-3 py-3">
                    <div className="h-4 w-full rounded bg-gray-200" />
                  </td>
                ))}

                {actions && (
                  <td className="px-3 py-3">
                    <div className="h-4 w-12 mx-auto rounded bg-gray-200" />
                  </td>
                )}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                onClick={() => onClick?.(item)}
                className={`
                  h-14
                  border-b border-gray-100
                  text-sm text-gray-700
                  transition-colors duration-150
                  hover:bg-[#f8f5fa]
                  ${onClick ? "cursor-pointer" : ""}
                `}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`
                      px-3 py-3
                      text-center align-middle
                      overflow-hidden text-ellipsis
                      ${col.className || ""}
                    `}
                    style={{ width: col.width }}
                  >
                    {col.render
                      ? col.render(item, rowIndex)
                      : item[col.field] ?? "-"}
                  </td>
                ))}

                {actions && (
                  <td className="px-3 py-3 text-center align-middle">
                    {actions(item, rowIndex)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="
                  py-10 px-4
                  text-center
                  text-sm text-gray-500
                "
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
};

export default TableComponent;
