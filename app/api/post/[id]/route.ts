import { POST_STATUS } from "@/constants/post";
import { getInsforgeServerClient } from "@/lib/insforge-server";
import { ImageObject } from "@/types/post.type";
import { NextRequest, NextResponse } from "next/server";

type PostUpdateData = {
    content?: string;
    images?: ImageObject[];
    scheduled_at?: string;
    status?: string;
    error_message?: string | null;
};

// ─── PATCH /api/post/[id] ─────────────────────────────────────────────────────
// BUG 2 FIX: Only update status when explicitly provided in the request body.
// Previously this always wrote `status = "queue"` even when only editing content.
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { insforge, userId } = await getInsforgeServerClient();
        if (!userId)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );

        const body = await request.json();
        const { content, images, scheduledAt, status } = body;

        const updateData: PostUpdateData = {};
        if (content !== undefined) updateData.content = content;
        if (Array.isArray(images)) updateData.images = images;
        if (scheduledAt !== undefined) updateData.scheduled_at = scheduledAt;

        // Only update status when it was explicitly sent in the request body
        if ("status" in body) {
            updateData.status =
                status === POST_STATUS.DRAFT
                    ? POST_STATUS.DRAFT
                    : POST_STATUS.QUEUE;

            // LOW-EFFORT 3: Retry support — clear stale error on re-queue
            if (updateData.status === POST_STATUS.QUEUE) {
                updateData.error_message = null;
            }
        }

        const { data, error } = await insforge.database
            .from("scheduled_posts")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) {
            console.error("Error updating post:", error);
            return NextResponse.json(
                { error: "Failed to update post" },
                { status: 500 },
            );
        }

        return NextResponse.json({ post: data });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// ─── DELETE /api/post/[id] ────────────────────────────────────────────────────
// BUG 1 FIX: Missing DELETE handler — users could not delete posts from the UI.
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { insforge, userId } = await getInsforgeServerClient();
        if (!userId)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );

        const { error } = await insforge.database
            .from("scheduled_posts")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) {
            console.error("Error deleting post:", error);
            return NextResponse.json(
                { error: "Failed to delete post" },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
