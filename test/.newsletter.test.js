const request = require("supertest");
const app = require("../index"); // Update with the path to your Express app

describe("Newsletter API Gateway Tests", () => {
  let token;
  let apiKey =
    "549c17e6e04a3db060bcc597e143ff4cb7110b4493d7d167fa0a699984ffdf15"; // Replace with a valid API key for testing

  beforeAll(async () => {
    // Assuming you have a way to get a JWT token for testing
    // token = await getToken(); // Implement your own token retrieval
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmMzM2I5MWQwNzM1NDIyMjZhYWY4YjciLCJ0ZW5hbnQiOnsiaWQiOiI2NmMyMWQ1ZjlhZGQ3MzU0ODk2ZjZiYTQiLCJuYW1lIjoiRGVmYXVsdCBUZW5hbnQiLCJzZXJ2aWNlcyI6W119LCJpYXQiOjE3MjQxNjMwODIsImV4cCI6MTcyNjc1NTA4Mn0.5nA0GyeRQgrsazVxWkFuULyk37JchGV7BwdVbiXap8A"; // Replace with a valid JWT token for testing
  });

  it("should reject requests with an invalid API key", async () => {
    const response = await request(app)
      .post("/api/v1/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", "invalid-api-key")
      .send({
        title: "Test Newsletter",
        content: "This is a test newsletter.",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden: Invalid API key");
  });

  it("should create a newsletter with a valid API key", async () => {
    const response = await request(app)
      .post("/api/v1/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", apiKey)
      .send({
        title: "Test Newsletter",
        content: "This is a test newsletter.",
      });

    expect(response.status).toBe(200); // Or whatever status your API returns on success
    expect(response.body.message).toBe("Newsletter created successfully");
  });

  it("should schedule a newsletter with a valid API key", async () => {
    const createResponse = await request(app)
      .post("/api/v1/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", apiKey)
      .send({
        title: "Test Newsletter for Scheduling",
        content: "This is a test newsletter for scheduling.",
      });

    const newsletterId = createResponse.body.newsletter._id;

    const response = await request(app)
      .post(`/api/v1/newsletters/schedule/${newsletterId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", apiKey)
      .send({ sendDate: "2024-08-25T10:00:00Z" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Newsletter scheduled successfully");
  });

  it("should send a newsletter immediately with a valid API key", async () => {
    const createResponse = await request(app)
      .post("/api/v1/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", apiKey)
      .send({
        title: "Test Newsletter for Immediate Sending",
        content: "This is a test newsletter for immediate sending.",
      });

    const newsletterId = createResponse.body.newsletter._id;

    const response = await request(app)
      .post(`/api/v1/newsletters/send/${newsletterId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Newsletter sent successfully");
  });

  it("should subscribe a user to the newsletter", async () => {
    const response = await request(app)
      .post("/api/v1/newsletters/subscribe")
      .send({ email: "testuser@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Subscription successful");
  });

  it("should unsubscribe a user from the newsletter", async () => {
    const response = await request(app)
      .get("/api/v1/newsletters/unsubscribe")
      .query({ email: "testuser@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Unsubscribed successfully");
  });

  it("should get all subscribers", async () => {
    const response = await request(app)
      .get("/api/v1/newsletters/subscribers")
      .set("Authorization", `Bearer ${token}`)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
