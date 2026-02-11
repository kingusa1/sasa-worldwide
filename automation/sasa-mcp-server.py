"""
SASA Worldwide MCP Server
Custom MCP server for SASA admin operations using PolyMCP

This server provides MCP tools for:
- Creating employee IDs
- Managing user accounts
- Generating reports
- Bulk operations
"""

from polymcp import Tool, MCPServer
from typing import Optional
import httpx
import os

# Initialize MCP Server
server = MCPServer(
    name="sasa-admin",
    description="SASA Worldwide Admin Operations MCP Server",
    version="1.0.0"
)

# Base URL for API calls
API_BASE = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")


@server.tool()
async def create_employee_id(
    employee_id: str,
    email: str,
    notes: Optional[str] = None,
    send_email: bool = True
) -> dict:
    """
    Create a new employee ID for staff registration

    Args:
        employee_id: Employee ID in format EMP-12345 or SASA-12345
        email: Email address to assign this employee ID to
        notes: Optional notes about this employee
        send_email: Whether to send the employee ID email immediately

    Returns:
        Result of employee ID creation
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/admin/employee-ids",
            json={
                "employeeId": employee_id,
                "email": email,
                "notes": notes,
                "sendEmail": send_email
            },
            headers={
                "Content-Type": "application/json",
                # TODO: Add authentication header
            }
        )
        return response.json()


@server.tool()
async def list_pending_signups() -> dict:
    """
    Get all pending staff signup requests

    Returns:
        List of pending signups waiting for admin approval
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE}/api/admin/signups/pending",
            headers={
                # TODO: Add authentication header
            }
        )
        return response.json()


@server.tool()
async def approve_signup(signup_id: str) -> dict:
    """
    Approve a pending staff signup request

    Args:
        signup_id: UUID of the signup request to approve

    Returns:
        Result of approval operation
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/admin/signups/{signup_id}/approve",
            headers={
                # TODO: Add authentication header
            }
        )
        return response.json()


@server.tool()
async def reject_signup(signup_id: str, reason: Optional[str] = None) -> dict:
    """
    Reject a pending staff signup request

    Args:
        signup_id: UUID of the signup request to reject
        reason: Optional reason for rejection (sent to user via email)

    Returns:
        Result of rejection operation
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/admin/signups/{signup_id}/reject",
            json={"reason": reason} if reason else {},
            headers={
                # TODO: Add authentication header
            }
        )
        return response.json()


@server.tool()
async def list_all_users(role: Optional[str] = None, status: Optional[str] = None) -> dict:
    """
    Get all users from the system

    Args:
        role: Filter by role (staff, affiliate, admin)
        status: Filter by status (active, pending, suspended, rejected)

    Returns:
        List of users matching the filters
    """
    async with httpx.AsyncClient() as client:
        params = {}
        if role:
            params["role"] = role
        if status:
            params["status"] = status

        response = await client.get(
            f"{API_BASE}/api/admin/users",
            params=params,
            headers={
                # TODO: Add authentication header
            }
        )
        return response.json()


@server.tool()
async def suspend_user(user_id: str) -> dict:
    """
    Suspend a user account (prevents login)

    Args:
        user_id: UUID of the user to suspend

    Returns:
        Result of suspension operation
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/admin/users/{user_id}/suspend",
            headers={
                # TODO: Add authentication header
            }
        )
        return response.json()


@server.tool()
async def activate_user(user_id: str) -> dict:
    """
    Activate a suspended user account

    Args:
        user_id: UUID of the user to activate

    Returns:
        Result of activation operation
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/admin/users/{user_id}/activate",
            headers={
                # TODO: Add authentication header
            }
        )
        return response.json()


@server.tool()
async def bulk_onboard_staff(employee_data: list[dict]) -> dict:
    """
    Onboard multiple staff members at once

    Args:
        employee_data: List of dicts with employee_id, email, notes
        Example: [
            {"employee_id": "EMP-001", "email": "john@sasa-worldwide.com", "notes": "Sales"},
            {"employee_id": "EMP-002", "email": "jane@sasa-worldwide.com", "notes": "Marketing"}
        ]

    Returns:
        Results of bulk operation
    """
    results = []
    for employee in employee_data:
        result = await create_employee_id(
            employee_id=employee["employee_id"],
            email=employee["email"],
            notes=employee.get("notes"),
            send_email=True
        )
        results.append({
            "employee_id": employee["employee_id"],
            "email": employee["email"],
            "result": result
        })

    return {
        "total": len(employee_data),
        "successful": len([r for r in results if r["result"].get("success")]),
        "results": results
    }


# Example usage and CLI
if __name__ == "__main__":
    import asyncio

    print("🚀 SASA Worldwide MCP Server")
    print("=" * 50)
    print("\nAvailable Tools:")
    print("- create_employee_id: Create new employee IDs")
    print("- list_pending_signups: View pending approvals")
    print("- approve_signup: Approve staff signup")
    print("- reject_signup: Reject staff signup")
    print("- list_all_users: View all users")
    print("- suspend_user: Suspend user account")
    print("- activate_user: Activate user account")
    print("- bulk_onboard_staff: Onboard multiple staff at once")
    print("\nTo start server: polymcp serve sasa-mcp-server.py")
    print("To use with Claude: Add to your MCP config")
