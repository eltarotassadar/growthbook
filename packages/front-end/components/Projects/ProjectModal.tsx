import { ProjectInterface } from "back-end/types/project";
import { useForm } from "react-hook-form";
import { useAuth } from "../../services/auth";
import MetricsSelector from "../Experiment/MetricsSelector";
import Modal from "../Modal";
import Field from "../Forms/Field";

export default function ProjectModal({
  existing,
  close,
  onSuccess,
}: {
  existing: Partial<ProjectInterface>;
  close: () => void;
  onSuccess: () => Promise<void>;
}) {
  const form = useForm<Partial<ProjectInterface>>({
    defaultValues: {
      name: existing.name || "",
      metrics: existing.metrics || [],
      dimensions: existing.dimensions || [],
      segments: existing.segments || [],
    },
  });

  const { apiCall } = useAuth();

  return (
    <Modal
      open={true}
      close={close}
      header="Create Project"
      submit={form.handleSubmit(async (value) => {
        await apiCall(existing.id ? `/projects/${existing.id}` : `/projects`, {
          method: existing.id ? "PUT" : "POST",
          body: JSON.stringify(value),
        });
        await onSuccess();
      })}
    >
      <Field name="Name" maxLength={30} required {...form.register("name")} />
      <div className="form-group">
        Metrics
        <MetricsSelector
          selected={form.watch("metrics")}
          onChange={(metrics) => {
            form.setValue("metrics", metrics);
          }}
        />
      </div>
    </Modal>
  );
}
