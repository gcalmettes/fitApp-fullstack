import React from "react";
import { PropTypes } from "prop-types";
import classNames from "classnames";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {
  AutoSizer,
  Column,
  SortDirection,
  Table,
} from "react-virtualized";

import { theme, addToTheme } from './theme';
import withStyles from "@material-ui/core/styles/withStyles";

/// see https://github.com/mui-org/material-ui/issues/7450#issuecomment-440731220


const styles = addToTheme({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box"
  },
  tableRow: {
    cursor: "pointer"
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: "initial"
  }
});

/**
 * An auto-height Table with scrolling controlled by the window (powered by react-virtualized)
 * @function
 * @param {object} props
 * @param {object[]} props.columns - Array of column objects used to render `Column` components within the `Table`.  The `dataKey` and `width` props are required.  `cellContentRenderer`, `className` are optional.  All other props are spread onto the react-virtualized `Column` component.
 * @param {number|function} [props.headerHeight=56] - react-virtualized `Table` requirement
 * @param {number} [props.rowCount=0] - react-virtualized `Table` requirement
 * @param {function} props.rowGetter - react-virtualized `Table` requirement
 * @param {number|function} [props.rowHeight=56] - react-virtualized `Table` requirement
 * @param {string} [props.rowClassName=null] - applied to each row, if specified
 * @param {object} props.classes - Provided by withStyles HOC
 * @param {string} props.classes.flexContainer - Applied to row, cell, and `Column` to configure as flex-box
 * @param {string} props.classes.tableRow - Applied to rows
 * @param {string} props.classes.tableRowHover - Applied to table rows (but not header rows), when `onRowClick` is provided
 * @param {string} props.classes.tableCell - Applied to `TableCell` components
 * @param {string} props.classes.noClick - Applied to `TableCell` components in header rows (or all rows, when `onRowClick` is not provided)
 * @param {...any} props.other - Any other props will be spread onto the react-virtualized `Table` component
 */
class VirtualizedTable extends React.PureComponent {
  /**
   * TableCell currently derives table style from context applied by parent
   * @private
   */
  getChildContext() {
    // eslint-disable-line class-methods-use-this
    return {
      table: {
        body: true
      }
    };
  }

  /**
   * Return the row class names
   * tableRowHover is applied to non-header rows when onRowClick has been specified
   * @private
   */
  getRowClassName = ({ index }) => {
    const {
      classes: { tableRow, tableRowHover, flexContainer },
      rowClassName,
      onRowClick
    } = this.props;
    return classNames({
      [tableRow]: true,
      [flexContainer]: true,
      [rowClassName]: true,
      [tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  /**
   * Render cell data within material-ui TableCell, optionally set cursor to initial if click handler was not supplied
   * @private
   */
  cellRenderer = ({ cellData, columnIndex = null }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, {
          [classes.flexContainer]: true,
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        numeric={(columnIndex != null && columns[columnIndex].numeric) || false}
      >
        {cellData}
      </TableCell>
    );
  };

  /**
   * Render column header with TableSortLabel for sortable columns, using the current sortBy/sortDirection for rendering indicators
   * @private
   */
  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { headerHeight, columns, classes, sort } = this.props;
    const direction = {
      [SortDirection.ASC]: "asc",
      [SortDirection.DESC]: "desc"
    };
    const inner =
      !columns[columnIndex].disableSort && sort != null ? (
        <TableSortLabel
          active={dataKey === sortBy}
          direction={direction[sortDirection]}
        >
          {label}
        </TableSortLabel>
      ) : (
        label
      );
    return (
      <TableCell
        component="div"
        className={classNames(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        numeric={columns[columnIndex].numeric || false}
      >
        {inner}
      </TableCell>
    );
  };

  render() {
    const { classes, columns, height, ...tableProps } = this.props;

    return (
      <div>
          <AutoSizer disableHeight>
            {({ width }) => (
              <Table
                height={height}
                width={width}
                {...tableProps}
                rowClassName={this.getRowClassName}
              >
                {columns.map(
                  (
                    { cellContentRenderer = null, className = null, ...other },
                    index
                  ) => {
                    let renderer;
                    if (cellContentRenderer != null) {
                      renderer = cellRendererProps =>
                        this.cellRenderer({
                          cellData: cellContentRenderer(cellRendererProps),
                          columnIndex: index
                        });
                    } else {
                      renderer = this.cellRenderer;
                    }
                    const columnProps = { cellRenderer: renderer, ...other };
                    return (
                      <Column
                        key={other.dataKey}
                        headerRenderer={headerProps =>
                          this.headerRenderer({
                            ...headerProps,
                            columnIndex: index
                          })
                        }
                        className={classNames(classes.flexContainer, className)}
                        {...columnProps}
                      />
                    );
                  }
                )}
              </Table>
            )}
          </AutoSizer>
        </div>
    );
  }
}

VirtualizedTable.propTypes = {
  classes: PropTypes.shape({
    flexContainer: PropTypes.string,
    noClick: PropTypes.string,
    tableCell: PropTypes.string,
    tableRow: PropTypes.string,
    tableRowHover: PropTypes.string
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      cellContentRenderer: PropTypes.func,
      dataKey: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.string,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sort: PropTypes.func
};

VirtualizedTable.defaultProps = {
  headerHeight: 56,
  onRowClick: undefined,
  rowClassName: null,
  rowHeight: 56,
  sort: undefined
};

VirtualizedTable.childContextTypes = {
  table: PropTypes.object
};

export default withStyles(styles)(VirtualizedTable);