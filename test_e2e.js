import fs from 'fs';
import path from 'path';

async function runTests() {
  console.log('=== STARTING FRAME FEST 26 E2E TEST SUITE ===\n');
  const baseUrl = 'http://localhost:5001';

  // 1. Health check
  console.log('1. Testing Backend Health Check...');
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const healthJson = await healthRes.json();
  if (healthRes.ok && healthJson.status === 'ok') {
    console.log('   ✓ Health check passed:', healthJson);
  } else {
    throw new Error('Health check failed');
  }

  // 2. Check Vite Frontend
  console.log('\n2. Testing Vite Frontend Server...');
  const feRes = await fetch('http://localhost:5173/');
  if (feRes.ok) {
    console.log('   ✓ Frontend index loaded successfully (Status: 200)');
  } else {
    throw new Error('Frontend server not responding');
  }

  // 3. Create a dummy PNG image for payment proof
  const testImagePath = path.join(process.cwd(), 'sample_receipt.png');
  // 1x1 transparent PNG buffer
  const samplePngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(testImagePath, samplePngBuffer);
  console.log('\n3. Created sample payment proof image:', testImagePath);

  // 4. Test validation failure on invalid phone
  console.log('\n4. Testing Phone Validation (expecting error)...');
  const badFormData = new FormData();
  badFormData.append('name', 'Test Participant');
  badFormData.append('registerNumber', 'TEST001');
  badFormData.append('department', 'Artificial Intelligence & Machine Learning');
  badFormData.append('section', 'A');
  badFormData.append('phone', '12345'); // Invalid length
  badFormData.append('email', 'test@example.com');
  badFormData.append('paymentProof', new Blob([samplePngBuffer], { type: 'image/png' }), 'sample_receipt.png');

  const badPhoneRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    body: badFormData
  });
  const badPhoneJson = await badPhoneRes.json();
  if (badPhoneRes.status === 400 && badPhoneJson.message.includes('phone')) {
    console.log('   ✓ Invalid phone correctly caught:', badPhoneJson.message);
  } else {
    throw new Error('Phone validation did not trigger as expected');
  }

  // 5. Test valid registration
  console.log('\n5. Submitting Valid Participant Registration (TEST001)...');
  const validFormData = new FormData();
  validFormData.append('name', 'Test Participant');
  validFormData.append('registerNumber', 'TEST001');
  validFormData.append('department', 'Artificial Intelligence & Machine Learning');
  validFormData.append('section', 'A');
  validFormData.append('phone', '9876543210');
  validFormData.append('email', 'test@example.com');
  validFormData.append('paymentProof', new Blob([samplePngBuffer], { type: 'image/png' }), 'sample_receipt.png');

  const regRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    body: validFormData
  });
  const regJson = await regRes.json();

  if (regRes.status === 201 && regJson.success) {
    console.log('   ✓ Registration saved successfully!');
    console.log('   - Registration ID:', regJson.data.registrationId);
    console.log('   - Participant Name:', regJson.data.name);
    console.log('   - Status:', regJson.data.status);
  } else {
    throw new Error(`Registration failed: ${JSON.stringify(regJson)}`);
  }

  const generatedId = regJson.data.registrationId;

  // 6. Test Duplicate Registration Prevention
  console.log('\n6. Testing Duplicate Prevention with same Register Number (TEST001)...');
  const dupFormData = new FormData();
  dupFormData.append('name', 'Another Person');
  dupFormData.append('registerNumber', 'TEST001');
  dupFormData.append('department', 'Computer Science Engineering');
  dupFormData.append('section', 'B');
  dupFormData.append('phone', '9123456780');
  dupFormData.append('email', 'another@example.com');
  dupFormData.append('paymentProof', new Blob([samplePngBuffer], { type: 'image/png' }), 'sample_receipt.png');

  const dupRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    body: dupFormData
  });
  const dupJson = await dupRes.json();

  if (dupRes.status === 409 && !dupJson.success) {
    console.log('   ✓ Duplicate correctly prevented!');
    console.log('   - Response message:', dupJson.message);
  } else {
    throw new Error(`Duplicate registration was NOT prevented: Status ${dupRes.status}`);
  }

  // 7. Test Admin Login
  console.log('\n7. Testing Admin Authentication...');
  const adminLoginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'admin2026' })
  });
  const adminLoginJson = await adminLoginRes.json();
  if (adminLoginRes.ok && adminLoginJson.success) {
    console.log('   ✓ Admin login authenticated successfully');
  } else {
    throw new Error('Admin authentication failed');
  }

  // 8. Test Admin Stats
  console.log('\n8. Testing Admin Stats...');
  const statsRes = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { 'x-admin-key': 'admin2026' }
  });
  const statsJson = await statsRes.json();
  console.log('   ✓ Stats returned:', statsJson);
  if (statsJson.total >= 1 && statsJson.pending >= 1) {
    console.log('   ✓ Total & Pending count match registered participant.');
  }

  // 9. Test Admin Search
  console.log('\n9. Testing Admin Search by Register Number (TEST001)...');
  const searchRes = await fetch(`${baseUrl}/api/admin/registrations?search=TEST001`, {
    headers: { 'x-admin-key': 'admin2026' }
  });
  const searchJson = await searchRes.json();
  if (searchJson.count >= 1 && searchJson.data[0].registerNumber === 'TEST001') {
    console.log('   ✓ Found record in admin search:', searchJson.data[0].registrationId, searchJson.data[0].name);
    console.log('   ✓ Payment proof path:', searchJson.data[0].paymentProof);
  } else {
    throw new Error('Admin search did not return expected record');
  }

  // 10. Test Payment Proof File Retrieval
  console.log('\n10. Testing Static Payment Proof Image Serving...');
  const proofUrl = `${baseUrl}${searchJson.data[0].paymentProof}`;
  const imgRes = await fetch(proofUrl);
  if (imgRes.ok) {
    console.log('   ✓ Payment proof image served with HTTP 200 OK');
  } else {
    throw new Error(`Failed to load uploaded image from ${proofUrl}`);
  }

  // 11. Test Admin Status Update (PENDING -> VERIFIED)
  console.log('\n11. Testing Status Update to VERIFIED...');
  const updateRes = await fetch(`${baseUrl}/api/admin/registrations/${generatedId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': 'admin2026'
    },
    body: JSON.stringify({ status: 'VERIFIED' })
  });
  const updateJson = await updateRes.json();
  if (updateRes.ok && updateJson.data.status === 'VERIFIED') {
    console.log('   ✓ Status updated to VERIFIED:', updateJson.data.registrationId);
  } else {
    throw new Error('Status update failed');
  }

  // 12. Test Admin CSV Export
  console.log('\n12. Testing CSV Export...');
  const csvRes = await fetch(`${baseUrl}/api/admin/export-csv?adminKey=admin2026`);
  const csvText = await csvRes.text();
  if (csvRes.ok && csvText.includes('TEST001') && csvText.includes(generatedId)) {
    console.log('   ✓ CSV exported successfully with participant records:\n');
    console.log(csvText.split('\r\n').slice(0, 3).join('\n'));
  } else {
    throw new Error('CSV Export did not include participant');
  }

  // Cleanup sample receipt file
  if (fs.existsSync(testImagePath)) {
    fs.unlinkSync(testImagePath);
  }

  console.log('\n=========================================');
  console.log('🎉 ALL 12 E2E TEST VERIFICATION STEPS PASSED!');
  console.log('=========================================');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
