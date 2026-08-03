import { SupabaseClient } from "@supabase/supabase-js";
import { CheckResult, CompletenessItem, DocType, Fields, SavedCheck, Standing, TrackerBoard, TrackerColumn } from "@/lib/types";

interface SavedCheckRow {
  id: string;
  board: TrackerBoard;
  doc_type: DocType;
  title: string;
  fields: Fields;
  standing: Standing;
  school_id: string;
  checks: CheckResult[];
  completeness: CompletenessItem[];
  tracker_column: TrackerColumn;
  checked_at: string;
}

function fromRow(row: SavedCheckRow): SavedCheck {
  return {
    id: row.id,
    board: row.board,
    docType: row.doc_type,
    title: row.title,
    fields: row.fields,
    standing: row.standing,
    schoolId: row.school_id,
    checks: row.checks,
    completeness: row.completeness,
    column: row.tracker_column,
    checkedAt: row.checked_at,
  };
}

export async function listSavedChecks(supabase: SupabaseClient, board: TrackerBoard): Promise<SavedCheck[]> {
  const { data, error } = await supabase
    .from("saved_checks")
    .select("*")
    .eq("board", board)
    .order("checked_at", { ascending: false });

  if (error) throw error;
  return (data as SavedCheckRow[]).map(fromRow);
}

export async function upsertSavedCheck(
  supabase: SupabaseClient,
  userId: string,
  payload: Omit<SavedCheck, "id" | "checkedAt">,
): Promise<void> {
  const { data: existing, error: findError } = await supabase
    .from("saved_checks")
    .select("id")
    .eq("board", payload.board)
    .eq("fields->>employer", payload.fields.employer)
    .eq("fields->>start", payload.fields.start)
    .eq("fields->>end", payload.fields.end)
    .maybeSingle();

  if (findError) throw findError;

  const row = {
    user_id: userId,
    board: payload.board,
    doc_type: payload.docType,
    title: payload.title,
    fields: payload.fields,
    standing: payload.standing,
    school_id: payload.schoolId,
    checks: payload.checks,
    completeness: payload.completeness,
    tracker_column: payload.column,
    checked_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase.from("saved_checks").update(row).eq("id", existing.id)
    : await supabase.from("saved_checks").insert(row);

  if (error) throw error;
}
