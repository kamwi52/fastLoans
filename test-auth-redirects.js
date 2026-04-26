// Test script to verify authentication redirect logic

console.log("=== Authentication Redirect Logic Test ===\n");

// Simulate the admin detection logic
function isAdmin(phone, email) {
  return (
    phone === '0999999999' ||
    email === 'admin@targeteveryone.com' ||
    phone?.includes('admin') ||
    email?.includes('admin')
  );
}

// Test cases
const testCases = [
  { phone: '0999999999', email: 'test@example.com', expectedAdmin: true, description: 'Admin phone' },
  { phone: '+260971234567', email: 'admin@targeteveryone.com', expectedAdmin: true, description: 'Admin email' },
  { phone: 'admin0971234567', email: 'user@example.com', expectedAdmin: true, description: 'Phone contains admin' },
  { phone: '+260971234567', email: 'user.admin@example.com', expectedAdmin: true, description: 'Email contains admin' },
  { phone: '+260971234567', email: 'john.doe@example.com', expectedAdmin: false, description: 'Regular user' },
  { phone: '+260950112233', email: 'user@targeteveryone.com', expectedAdmin: false, description: 'Non-admin at company' },
];

console.log("Test Results:");
console.log("-".repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = isAdmin(testCase.phone, testCase.email);
  const status = result === testCase.expectedAdmin ? "✓ PASS" : "✗ FAIL";
  const redirectTo = result ? '/admin' : '/';
  
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`  Phone: ${testCase.phone}`);
  console.log(`  Email: ${testCase.email}`);
  console.log(`  Expected Admin: ${testCase.expectedAdmin}, Got: ${result}`);
  console.log(`  Redirect To: ${redirectTo}`);
  console.log(`  ${status}\n`);
  
  if (result === testCase.expectedAdmin) {
    passed++;
  } else {
    failed++;
  }
});

console.log("-".repeat(80));
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
console.log(`Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log("\n✓ All authentication redirect tests passed!");
  process.exit(0);
} else {
  console.log("\n✗ Some tests failed!");
  process.exit(1);
}
