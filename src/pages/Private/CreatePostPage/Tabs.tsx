import { motion, Reorder } from 'framer-motion';
import { Ingredient } from './CreatePostPage.page';

interface Props {
  item: Ingredient;
  isSelected: boolean;
  onClick: () => void;
  // onRemove: () => void;
}

export const Tab = ({ item, onClick, isSelected }: Props) => {
  return (
    <Reorder.Item
      value={item}
      id={item.label}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        backgroundColor: isSelected ? '#f3f3f3' : 'white',
        y: 0,
        transition: { duration: 0.15 }
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
      whileDrag={{ backgroundColor: '#e3e3e3' }}
      className={isSelected ? 'selected-tab' : 'not-selected-tab'}
      onPointerDown={onClick}
    >
      <motion.span layout="position">{item.label}</motion.span>
      {/* <motion.div layout className="close">
        <motion.button
          onPointerDown={(event) => {
            event.stopPropagation();
            // onRemove();
          }}
          initial={false}
          animate={{ backgroundColor: isSelected ? '#e3e3e3' : '#fff' }}
        >
          <CloseIcon />
        </motion.button>
      </motion.div> */}
    </Reorder.Item>
  );
};
