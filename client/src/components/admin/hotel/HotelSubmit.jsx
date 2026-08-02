import { Save, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HotelSubmit = ({
  loading = false,
  isEdit = false,
  onCancel,
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-5">
        <div>
          {/* Explicit heading text color */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ready to Publish?
          </h2>

          {/* Explicit paragraph text color */}
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Review all information before saving this hotel.
          </p>
        </div>

        <div className="flex gap-4">
          {/* Explicit cancel button text & background colors */}
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEdit ? "Update Hotel" : "Save Hotel"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelSubmit;