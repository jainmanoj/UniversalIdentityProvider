import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

const tableConfig = {
  fixedHeader: true,
  displaySelectAll: false,
  showRowHover: true,
  selectable: true,
  multiSelectable: true,
  enableSelectAll: false,
  deselectOnClickaway: false,
  allRowsSelected: false,
  tableLayout: 'fixed',
  height: '290px'
};

const ConsentForm = ({ attributes, onSubmit, onChange }) => (
  <Card className="container-dialog">
    <div>
      <Table
        height={tableConfig.height}
        style={{ width: '2000px !important' }}
        fixedHeader={tableConfig.fixedHeader}
        displaySelectAll={tableConfig.displaySelectAllade}
        selectable={tableConfig.selectable}
        multiSelectable={tableConfig.multiSelectable}
        allRowsSelected={tableConfig.allRowsSelected}
        onRowSelection={onChange}
        onCellClick={onChange}
      >
        <TableHeader enableSelectAll={tableConfig.enableSelectAll}>
          <TableRow displayBorder>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>AttributeName</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={tableConfig.deselectOnClickaway}
          showRowHover={tableConfig.showRowHover}
        >
          {attributes.map(({ id, name, isSelected }) => (
            <TableRow key={id} selected={isSelected}>
              <TableRowColumn>{id}</TableRowColumn>
              <TableRowColumn>{name}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <div className="button-line">
      <RaisedButton
        type="submit"
        onClick={onSubmit}
        label="Authorize"
        primary
      />
    </div>
  </Card>
);

//     handleRowSelection = row => {
//     const { onSelect } = this.props;
//     if (this.refs[row]) {
//       const { victim , selected } = this.refs[row].props;
//       if (!selected) {
//         onSelect(victim);
//       } else {
//         // deselect when already selected
//         onSelect({});
//       }
//     }
//   };

ConsentForm.propTypes = {
  attributes: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ConsentForm;
