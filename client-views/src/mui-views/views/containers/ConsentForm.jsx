//WE ARE NOT USING THIS - Will Do it later

// import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

// const tableConfig = {
//   fixedHeader: true,
//   displaySelectAll: false,
//   showRowHover: true,
//   selectable: true,
//   multiSelectable: true,
//   enableSelectAll: false,
//   deselectOnClickaway: false,
//   allRowsSelected: false,
//   height: '290px'
// };
// const styles = {
//   root: {
//     width: '70%',
//     overflowX: 'auto'
//   },
//   table: {
//     minWidth: 300
//   }
// };

// const ConsentForm = ({ attributes, onSubmit, onChange, classes }) => (
//   <Card className="container-dialog">
//     <div>
//       <Table className={classes.table}>
//         <TableHead enableSelectAll={tableConfig.enableSelectAll}>
//           <TableRow displayBorder>
//             <TableCell>ID</TableCell>
//             <TableCell>AttributeName</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody
//           deselectOnClickaway={tableConfig.deselectOnClickaway}
//           showRowHover={tableConfig.showRowHover}
//         >
//           {attributes.map(({ id, name, isSelected }) => (
//             <TableRow key={id} selected={isSelected}>
//               <TableCell>{id}</TableCell>
//               <TableCell>{name}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   </Card>
// );
// ConsentForm.propTypes = {
//   attributes: PropTypes.array.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired
// };

// export default withStyles(styles)(ConsentForm);
