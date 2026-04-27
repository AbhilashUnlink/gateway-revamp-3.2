import DropDown from '@/components/ui/drop-down';
import DasPopover from '@/components/ui/popover';

function TransactionsPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      {/* <h1 className="text-xl font-semibold text-neutral-700">Transactions</h1> */}
      {/* <Select /> */}
      <DropDown />
      {/* <AutoComplete /> */}
      {/* <DasSwitch /> */}
      {/* <DasDialog /> */}
      <DasPopover />
      {/* <DasTabs /> */}
    </div>
  );
}
export default TransactionsPage;
