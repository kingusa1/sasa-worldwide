# SASA Worldwide PolyMCP Automation

This folder contains PolyMCP-powered automation tools for SASA Worldwide admin operations.

## 🎯 What is PolyMCP?

PolyMCP allows you to create custom MCP (Model Context Protocol) servers that expose your SASA admin operations as tools that AI assistants (like Claude) can use.

**Example:** Instead of manually creating 10 employee IDs, you can tell Claude:
> "Create employee IDs for these 10 new sales staff members: [list of emails]"

And Claude will use your custom MCP server to automatically create all 10 IDs and send welcome emails!

## 📦 Installation

PolyMCP is already installed! ✅

```bash
# Verify installation
python -c "import polymcp; print(polymcp.__version__)"
# Should output: 1.3.6
```

## 🚀 Quick Start

### 1. Start the SASA MCP Server

```bash
cd automation
python sasa-mcp-server.py
```

This starts a local MCP server that exposes SASA admin operations.

### 2. Configure in Claude Desktop (Optional)

Add to your Claude Desktop MCP config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "sasa-admin": {
      "command": "python",
      "args": ["C:\\Users\\kingu\\Downloads\\well-known\\automation\\sasa-mcp-server.py"],
      "env": {
        "NEXT_PUBLIC_APP_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 3. Use in Claude Code

Once configured, you can use natural language commands:

```
"Create employee ID EMP-12345 for john@sasa-worldwide.com and send email"
"Show me all pending signups"
"Approve all pending signups from yesterday"
"Create 5 employee IDs for the new sales team"
```

## 🛠️ Available Tools

### Employee ID Management
- **`create_employee_id`**: Create a new employee ID
- **`bulk_onboard_staff`**: Create multiple employee IDs at once

### User Management
- **`list_all_users`**: View all users with filters
- **`suspend_user`**: Suspend a user account
- **`activate_user`**: Reactivate a user

### Signup Management
- **`list_pending_signups`**: View pending approvals
- **`approve_signup`**: Approve a staff signup
- **`reject_signup`**: Reject a staff signup

## 📝 Example Use Cases

### Use Case 1: Bulk Onboarding
**Scenario:** You need to onboard 20 new sales staff members

**Before (Manual):**
1. Login to admin dashboard
2. Go to Employee IDs
3. Click "Create Employee ID" 20 times
4. Fill form each time
5. Click "Send Email" 20 times
6. Takes ~30 minutes

**After (With PolyMCP):**
Tell Claude:
```
"Create employee IDs for these 20 new sales staff:
- john@sasa-worldwide.com (Sales Manager)
- jane@sasa-worldwide.com (Sales Rep)
- ... (18 more)
Send welcome emails to all of them."
```
Takes ~30 seconds! ⚡

### Use Case 2: Daily Approval Workflow
**Before (Manual):**
- Login to admin panel
- Click through each pending signup
- Review details
- Click approve/reject
- Repeat for all signups

**After (With PolyMCP):**
```
"Show me all pending signups from today.
Approve all signups with @sasa-worldwide.com email domain.
Reject any with invalid employee IDs."
```

### Use Case 3: User Cleanup
**Before (Manual):**
- Navigate to user management
- Search for inactive users
- Click suspend on each one
- Takes 10-15 minutes

**After (With PolyMCP):**
```
"Find all users who haven't logged in for 90 days and suspend them.
Send me a report of who was suspended."
```

## 🔐 Security Notes

⚠️ **IMPORTANT:** The current implementation does NOT include authentication.

**Before using in production:**

1. Add admin authentication to all MCP tool calls
2. Use environment variables for credentials
3. Implement rate limiting
4. Add audit logging for MCP operations

Example secure implementation:

```python
import os

# Get admin session token
ADMIN_TOKEN = os.getenv("SASA_ADMIN_TOKEN")

@server.tool()
async def create_employee_id(...):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/admin/employee-ids",
            json={...},
            headers={
                "Authorization": f"Bearer {ADMIN_TOKEN}",
                "Content-Type": "application/json",
            }
        )
```

## 🎨 Customization

### Add New Tools

Edit `sasa-mcp-server.py` and add new functions with `@server.tool()`:

```python
@server.tool()
async def generate_monthly_report() -> dict:
    """
    Generate monthly admin report with stats

    Returns:
        Report with user counts, signups, etc.
    """
    # Your implementation
    pass
```

### Create Workflow Agents

Create agents that chain multiple operations:

```python
@server.tool()
async def onboard_new_hire(name: str, email: str, department: str) -> dict:
    """
    Complete onboarding workflow for new hire

    1. Creates employee ID
    2. Sends welcome email
    3. Notifies department manager
    4. Creates Google Drive folder
    5. Adds to Slack channel
    """
    # Implementation
    pass
```

## 📊 Future Enhancements

Potential additions:
- ✅ Bulk operations
- ✅ User management
- ⏳ Report generation
- ⏳ Email template management
- ⏳ Analytics and dashboards
- ⏳ Slack notifications
- ⏳ Google Drive integration
- ⏳ Calendar scheduling

## 🤝 Contributing

To add new automation tools:

1. Add function to `sasa-mcp-server.py`
2. Decorate with `@server.tool()`
3. Document parameters and returns
4. Test with `python sasa-mcp-server.py`
5. Update this README

## 📚 Resources

- [PolyMCP Documentation](https://github.com/poly-mcp/PolyMCP)
- [MCP Specification](https://modelcontextprotocol.io/)
- [SASA Worldwide API Docs](../docs/api.md)

---

**Made with PolyMCP** 🚀 | **SASA Worldwide** 🌍
