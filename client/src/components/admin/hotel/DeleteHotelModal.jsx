import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

const DeleteHotelModal = ({
  open,
  hotel,
  loading,
  onClose,
  onDelete,
}) => {
  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
        >

          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
            }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >

            {/* Header */}

            <div className="bg-red-50 border-b p-6">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-red-100 flex justify-center items-center">

                  <AlertTriangle
                    size={30}
                    className="text-red-600"
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    Delete Hotel
                  </h2>

                  <p className="text-gray-500">
                    This action cannot be undone.
                  </p>

                </div>

              </div>

            </div>

            {/* Body */}

            <div className="p-6">

              {hotel && (

                <div className="flex gap-5">

                  <img
                    src={hotel.thumbnail}
                    alt={hotel.name}
                    className="w-28 h-24 rounded-xl object-cover"
                  />

                  <div>

                    <h3 className="font-bold text-lg">
                      {hotel.name}
                    </h3>

                    <p className="text-gray-500">
                      {hotel.city}, {hotel.country}
                    </p>

                    <p className="text-primary font-semibold mt-2">
                      ₹{hotel.pricePerNight}
                    </p>

                  </div>

                </div>

              )}

              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4">

                <p className="text-red-700">

                  Are you sure you want to permanently
                  delete this hotel?

                </p>

                <p className="text-sm text-red-500 mt-2">

                  Hotel

                  bookings,

                  reviews,

                  and

                  related

                  information

                  may

                  also

                  become

                  inaccessible.

                </p>

              </div>

            </div>

            {/* Footer */}

            <div className="border-t p-6 flex justify-end gap-4">

              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition flex items-center gap-2"
              >
                <X size={18} />

                Cancel

              </button>

              <button
                onClick={onDelete}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 disabled:opacity-50"
              >

                <Trash2 size={18} />

                {loading
                  ? "Deleting..."
                  : "Delete Hotel"}

              </button>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
};

export default DeleteHotelModal;