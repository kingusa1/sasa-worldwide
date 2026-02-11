"""
Example: Bulk Onboard Staff Using PolyMCP

This script shows how to use the SASA MCP server to bulk onboard staff members.
"""

import asyncio
import sys
sys.path.append('..')

from sasa_mcp_server import create_employee_id, bulk_onboard_staff


async def example_single_employee():
    """Create a single employee ID"""
    print("📋 Example 1: Creating single employee ID")
    print("-" * 50)

    result = await create_employee_id(
        employee_id="EMP-12345",
        email="john.doe@sasa-worldwide.com",
        notes="New sales team member",
        send_email=True
    )

    print(f"✅ Result: {result}")
    print()


async def example_bulk_onboarding():
    """Onboard multiple staff members at once"""
    print("📋 Example 2: Bulk onboarding new sales team")
    print("-" * 50)

    # New sales team members
    new_staff = [
        {
            "employee_id": "EMP-00101",
            "email": "sarah.johnson@sasa-worldwide.com",
            "notes": "Sales Manager - Dubai"
        },
        {
            "employee_id": "EMP-00102",
            "email": "michael.chen@sasa-worldwide.com",
            "notes": "Sales Representative - Abu Dhabi"
        },
        {
            "employee_id": "EMP-00103",
            "email": "fatima.ahmed@sasa-worldwide.com",
            "notes": "Sales Representative - Sharjah"
        },
        {
            "employee_id": "EMP-00104",
            "email": "david.wilson@sasa-worldwide.com",
            "notes": "Sales Executive - Al Ain"
        },
        {
            "employee_id": "EMP-00105",
            "email": "layla.hassan@sasa-worldwide.com",
            "notes": "Business Development - Dubai"
        }
    ]

    print(f"Creating {len(new_staff)} employee IDs...")
    result = await bulk_onboard_staff(new_staff)

    print(f"\n✅ Bulk Onboarding Complete!")
    print(f"   Total: {result['total']}")
    print(f"   Successful: {result['successful']}")
    print(f"   Failed: {result['total'] - result['successful']}")

    print("\n📧 Welcome emails sent to:")
    for r in result['results']:
        status = "✅" if r['result'].get('success') else "❌"
        print(f"   {status} {r['email']} ({r['employee_id']})")


async def example_with_error_handling():
    """Example with proper error handling"""
    print("📋 Example 3: With error handling")
    print("-" * 50)

    try:
        result = await create_employee_id(
            employee_id="INVALID-FORMAT",  # Wrong format
            email="test@sasa-worldwide.com",
            send_email=False
        )
        print(f"✅ Success: {result}")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("   Make sure the API is running on http://localhost:3000")


async def main():
    """Run all examples"""
    print("\n" + "=" * 50)
    print("🚀 SASA PolyMCP Bulk Onboarding Examples")
    print("=" * 50 + "\n")

    # Example 1: Single employee
    await example_single_employee()

    # Example 2: Bulk onboarding
    await example_bulk_onboarding()

    # Example 3: Error handling
    await example_with_error_handling()

    print("\n" + "=" * 50)
    print("✅ All examples completed!")
    print("=" * 50 + "\n")

    print("💡 Next steps:")
    print("   1. Start your Next.js dev server: npm run dev")
    print("   2. Configure authentication in sasa-mcp-server.py")
    print("   3. Run this script: python bulk-onboard-example.py")
    print("   4. Or use with Claude Code for natural language commands!")


if __name__ == "__main__":
    # Run examples
    asyncio.run(main())
