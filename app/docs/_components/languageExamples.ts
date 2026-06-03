export type DocsLanguageKey =
    | 'typescript'
    | 'python'
    | 'go'
    | 'java'
    | 'dotnet'
    | 'php'
    | 'ruby'
    | 'curl';

export type DocsLanguage = {
    key: DocsLanguageKey;
    label: string;
    shortLabel: string;
    packageName: string;
    registry: string;
};

export type LanguageSnippet = {
    filename: string;
    language: string;
    code: string;
    caption?: string;
};

export type LanguageSnippetMap = Record<DocsLanguageKey, LanguageSnippet>;

export const docsLanguages: DocsLanguage[] = [
    {
        key: 'typescript',
        label: 'JavaScript / TypeScript',
        shortLabel: 'JS/TS',
        packageName: 'chefu-academy-sdk',
        registry: 'npm',
    },
    {
        key: 'python',
        label: 'Python',
        shortLabel: 'Python',
        packageName: 'chefu-academy',
        registry: 'PyPI',
    },
    {
        key: 'go',
        label: 'Go',
        shortLabel: 'Go',
        packageName: 'github.com/CheFu-code/chefu-academy-sdk/clients/go',
        registry: 'Go module proxy',
    },
    {
        key: 'java',
        label: 'Java',
        shortLabel: 'Java',
        packageName: 'com.chefuinc:chefu-academy',
        registry: 'Maven Central',
    },
    {
        key: 'dotnet',
        label: '.NET',
        shortLabel: '.NET',
        packageName: 'CheFu.Academy',
        registry: 'NuGet',
    },
    {
        key: 'php',
        label: 'PHP',
        shortLabel: 'PHP',
        packageName: 'chefu/academy',
        registry: 'Packagist',
    },
    {
        key: 'ruby',
        label: 'Ruby',
        shortLabel: 'Ruby',
        packageName: 'chefu_academy',
        registry: 'RubyGems',
    },
    {
        key: 'curl',
        label: 'cURL',
        shortLabel: 'cURL',
        packageName: 'chefu-academy.sh',
        registry: 'Repository helper',
    },
];

export const installExamples: LanguageSnippetMap = {
    typescript: {
        filename: 'Terminal',
        language: 'bash',
        code: 'npm install chefu-academy-sdk',
        caption:
            'Use npm for Node.js, Next.js, backend services, and TypeScript projects.',
    },
    python: {
        filename: 'Terminal',
        language: 'bash',
        code: 'pip install chefu-academy',
        caption: 'Install from PyPI for Python 3.9 and newer.',
    },
    go: {
        filename: 'Terminal',
        language: 'bash',
        code: 'go get github.com/CheFu-code/chefu-academy-sdk/clients/go@v0.1.0',
        caption: 'Go consumes the client through the public Go module proxy.',
    },
    java: {
        filename: 'pom.xml',
        language: 'xml',
        code: `<dependency>
  <groupId>com.chefuinc</groupId>
  <artifactId>chefu-academy</artifactId>
  <version>0.1.0</version>
</dependency>`,
        caption: 'Add the Maven Central dependency to a Java 11+ project.',
    },
    dotnet: {
        filename: 'Terminal',
        language: 'bash',
        code: 'dotnet add package CheFu.Academy --version 0.1.0',
        caption: 'Install from NuGet for .NET projects.',
    },
    php: {
        filename: 'Terminal',
        language: 'bash',
        code: 'composer require chefu/academy',
        caption: 'Install from Packagist with Composer.',
    },
    ruby: {
        filename: 'Terminal',
        language: 'bash',
        code: 'gem install chefu_academy -v 0.1.0',
        caption: 'Install from RubyGems.',
    },
    curl: {
        filename: 'Terminal',
        language: 'bash',
        code: `curl -fsSL https://raw.githubusercontent.com/CheFu-code/CheFu-Academy-SDK/main/clients/curl/chefu-academy.sh -o chefu-academy.sh
chmod +x chefu-academy.sh`,
        caption:
            'Use the shell helper for CI jobs, scripts, and quick API checks.',
    },
};

export const createClientExamples: LanguageSnippetMap = {
    typescript: {
        filename: 'server.ts',
        language: 'typescript',
        code: `import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
  apiKey: process.env.CHEFU_API_KEY,
  timeout: 10000,
});`,
        caption:
            'Initialize once in server-side code and reuse the SDK instance.',
    },
    python: {
        filename: 'main.py',
        language: 'python',
        code: `import os

from chefu_academy import CheFuAcademy

client = CheFuAcademy(
    api_key=os.environ["CHEFU_API_KEY"],
    timeout=10,
)`,
        caption:
            'Create one Python client and share it across your service layer.',
    },
    go: {
        filename: 'main.go',
        language: 'go',
        code: `client := chefuacademy.NewClient(chefuacademy.Config{
    APIKey: os.Getenv("CHEFU_API_KEY"),
})`,
        caption:
            'Pass a Config object with the API key loaded from the environment.',
    },
    java: {
        filename: 'Main.java',
        language: 'java',
        code: `CheFuAcademyClient client = CheFuAcademyClient.withApiKey(
    System.getenv("CHEFU_API_KEY")
);`,
        caption: 'Use the static helper for API-key authenticated requests.',
    },
    dotnet: {
        filename: 'Program.cs',
        language: 'csharp',
        code: `using CheFu.Academy;

var client = new CheFuAcademyClient(
    apiKey: Environment.GetEnvironmentVariable("CHEFU_API_KEY")
);`,
        caption: 'The .NET client accepts an API key and optional HttpClient.',
    },
    php: {
        filename: 'index.php',
        language: 'php',
        code: `<?php

require __DIR__ . '/vendor/autoload.php';

use CheFu\\Academy\\CheFuAcademyClient;

$client = new CheFuAcademyClient(
    apiKey: getenv('CHEFU_API_KEY') ?: null
);`,
        caption: 'Load the Composer autoloader, then create the client.',
    },
    ruby: {
        filename: 'app.rb',
        language: 'ruby',
        code: `require 'chefu_academy'

client = CheFuAcademy::Client.new(
  api_key: ENV.fetch('CHEFU_API_KEY')
)`,
        caption:
            'Ruby reads the key from the environment just like the other clients.',
    },
    curl: {
        filename: 'Terminal',
        language: 'bash',
        code: `export CHEFU_API_KEY="chf_publicId_secret"
export CHEFU_API_BASE_URL="https://api.chefuinc.com/api"`,
        caption:
            'The helper and raw curl examples read CHEFU_API_KEY from your shell.',
    },
};

export const courseRequestExamples: LanguageSnippetMap = {
    typescript: {
        filename: 'courses.ts',
        language: 'typescript',
        code: `const courses = await sdk.courses.search({
  query: 'machine learning',
  category: 'Technology',
  limit: 10,
});

const course = await sdk.courses.getById(courses.courses[0].id);
const lessons = await sdk.courses.getLessons(course.id, 0);
const quiz = await sdk.courses.getQuiz(course.id);`,
    },
    python: {
        filename: 'courses.py',
        language: 'python',
        code: `courses = client.courses.search(
    query="machine learning",
    category="Technology",
    limit=10,
)

course = client.courses.get(courses["courses"][0]["id"])
lessons = client.courses.lessons(course["id"], 0)
quiz = client.courses.quiz(course["id"])`,
    },
    go: {
        filename: 'courses.go',
        language: 'go',
        code: `courses, err := client.SearchCourses(ctx, chefuacademy.ListOptions{
    Query: "machine learning",
    Category: "Technology",
    Limit: 10,
})
if err != nil {
    return err
}

courseID := courses.Courses[0]["id"].(string)
course, err := client.Course(ctx, courseID)
lessons, err := client.CourseLessons(ctx, courseID, 0)
quiz, err := client.CourseQuiz(ctx, courseID)`,
    },
    java: {
        filename: 'Courses.java',
        language: 'java',
        code: `JsonNode courses = client.searchCourses(Map.of(
    "query", "machine learning",
    "category", "Technology",
    "limit", 10
));

String courseId = courses.get("courses").get(0).get("id").asText();
JsonNode course = client.course(courseId);
JsonNode lessons = client.courseLessons(courseId, 0);
JsonNode quiz = client.courseQuiz(courseId);`,
    },
    dotnet: {
        filename: 'Courses.cs',
        language: 'csharp',
        code: `var courses = await client.SearchCoursesAsync(
    new Dictionary<string, object?>
    {
        ["query"] = "machine learning",
        ["category"] = "Technology",
        ["limit"] = 10,
    });

var courseId = courses?["courses"]?[0]?["id"]?.GetValue<string>()!;
var course = await client.CourseAsync(courseId);
var lessons = await client.CourseLessonsAsync(courseId, 0);
var quiz = await client.CourseQuizAsync(courseId);`,
    },
    php: {
        filename: 'courses.php',
        language: 'php',
        code: `$courses = $client->searchCourses([
    'query' => 'machine learning',
    'category' => 'Technology',
    'limit' => 10,
]);

$courseId = $courses['courses'][0]['id'];
$course = $client->course($courseId);
$lessons = $client->courseLessons($courseId, 0);
$quiz = $client->courseQuiz($courseId);`,
    },
    ruby: {
        filename: 'courses.rb',
        language: 'ruby',
        code: `courses = client.search_courses(
  query: 'machine learning',
  category: 'Technology',
  limit: 10
)

course_id = courses['courses'][0]['id']
course = client.course(course_id)
lessons = client.course_lessons(course_id, 0)
quiz = client.course_quiz(course_id)`,
    },
    curl: {
        filename: 'Terminal',
        language: 'bash',
        code: `curl --fail --silent --show-error \\
  --header "Authorization: Bearer $CHEFU_API_KEY" \\
  "https://api.chefuinc.com/api/courses/search?query=machine%20learning&category=Technology&limit=10"`,
    },
};

export const videoRequestExamples: LanguageSnippetMap = {
    typescript: {
        filename: 'videos.ts',
        language: 'typescript',
        code: `const videos = await sdk.videos.search({
  query: 'microchips',
  category: 'Technology & Gadgets',
  limit: 8,
});

const video = await sdk.videos.getById(videos.videos[0].id);
const related = await sdk.videos.getByCategory(video.category ?? 'Technology');`,
    },
    python: {
        filename: 'videos.py',
        language: 'python',
        code: `videos = client.videos.search(
    query="microchips",
    category="Technology & Gadgets",
    limit=8,
)

video = client.videos.get(videos["videos"][0]["id"])
related = client.videos.category(video.get("category") or "Technology")`,
    },
    go: {
        filename: 'videos.go',
        language: 'go',
        code: `videos, err := client.SearchVideos(ctx, chefuacademy.ListOptions{
    Query: "microchips",
    Category: "Technology & Gadgets",
    Limit: 8,
})
if err != nil {
    return err
}

video, err := client.Video(ctx, videos.Videos[0]["id"].(string))
related, err := client.VideosByCategory(ctx, video["category"].(string))`,
    },
    java: {
        filename: 'Videos.java',
        language: 'java',
        code: `JsonNode videos = client.searchVideos(Map.of(
    "query", "microchips",
    "category", "Technology & Gadgets",
    "limit", 8
));

String videoId = videos.get("videos").get(0).get("id").asText();
JsonNode video = client.video(videoId);
JsonNode related = client.videosByCategory(video.get("category").asText());`,
    },
    dotnet: {
        filename: 'Videos.cs',
        language: 'csharp',
        code: `var videos = await client.SearchVideosAsync(
    new Dictionary<string, object?>
    {
        ["query"] = "microchips",
        ["category"] = "Technology & Gadgets",
        ["limit"] = 8,
    });

var videoId = videos?["videos"]?[0]?["id"]?.GetValue<string>()!;
var video = await client.VideoAsync(videoId);
var related = await client.VideosByCategoryAsync(
    video?["category"]?.GetValue<string>() ?? "Technology");`,
    },
    php: {
        filename: 'videos.php',
        language: 'php',
        code: `$videos = $client->searchVideos([
    'query' => 'microchips',
    'category' => 'Technology & Gadgets',
    'limit' => 8,
]);

$video = $client->video($videos['videos'][0]['id']);
$related = $client->videosByCategory($video['category'] ?? 'Technology');`,
    },
    ruby: {
        filename: 'videos.rb',
        language: 'ruby',
        code: `videos = client.search_videos(
  query: 'microchips',
  category: 'Technology & Gadgets',
  limit: 8
)

video = client.video(videos['videos'][0]['id'])
related = client.videos_by_category(video['category'] || 'Technology')`,
    },
    curl: {
        filename: 'Terminal',
        language: 'bash',
        code: `curl --fail --silent --show-error \\
  --header "Authorization: Bearer $CHEFU_API_KEY" \\
  "https://api.chefuinc.com/api/videos/search?query=microchips&category=Technology%20%26%20Gadgets&limit=8"`,
    },
};

export const keyManagementExamples: LanguageSnippetMap = {
    typescript: {
        filename: 'keys.ts',
        language: 'typescript',
        code: `const session = await sdk.auth.login(email, password);

const created = await sdk.keys.create({
  name: 'Production API',
});

const keys = await sdk.keys.list();
await sdk.keys.revoke(keys[0].id);`,
    },
    python: {
        filename: 'keys.py',
        language: 'python',
        code: `session = client.auth.login(email, password)

created = client.keys.create("Production API")
keys = client.keys.list()
client.keys.revoke(keys[0]["id"])`,
    },
    go: {
        filename: 'keys.go',
        language: 'go',
        code: `session, err := client.Login(ctx, email, password)
if err != nil {
    return err
}

created, err := client.CreateKey(ctx, "Production API")
keys, err := client.ListKeys(ctx)
_, err = client.RevokeKey(ctx, keys[0]["id"].(string))
_ = session
_ = created`,
    },
    java: {
        filename: 'Keys.java',
        language: 'java',
        code: `JsonNode session = client.login(email, password);

JsonNode created = client.createKey("Production API");
JsonNode keys = client.listKeys();
client.revokeKey(keys.get(0).get("id").asText());`,
    },
    dotnet: {
        filename: 'Keys.cs',
        language: 'csharp',
        code: `var session = await client.LoginAsync(email, password);

var created = await client.CreateKeyAsync("Production API");
var keys = await client.ListKeysAsync();
await client.RevokeKeyAsync(keys?[0]?["id"]?.GetValue<string>()!);`,
    },
    php: {
        filename: 'keys.php',
        language: 'php',
        code: `$session = $client->login($email, $password);

$created = $client->createKey('Production API');
$keys = $client->listKeys();
$client->revokeKey($keys[0]['id']);`,
    },
    ruby: {
        filename: 'keys.rb',
        language: 'ruby',
        code: `session = client.login(email: email, password: password)

created = client.create_key(name: 'Production API')
keys = client.list_keys
client.revoke_key(keys[0]['id'])`,
    },
    curl: {
        filename: 'Terminal',
        language: 'bash',
        code: `SESSION_JSON=$(./chefu-academy.sh auth login "$CHEFU_EMAIL" "$CHEFU_PASSWORD")
ID_TOKEN=$(printf '%s' "$SESSION_JSON" | jq -r '.idToken // .token')

./chefu-academy.sh keys create "$ID_TOKEN" "Production API"
./chefu-academy.sh keys list "$ID_TOKEN"
./chefu-academy.sh keys revoke "$ID_TOKEN" "$KEY_ID"`,
    },
};

export const errorHandlingExamples: LanguageSnippetMap = {
    typescript: {
        filename: 'error-handling.ts',
        language: 'typescript',
        code: `import { CheFuAcademyError } from 'chefu-academy-sdk';

try {
  return await sdk.courses.getAll({ limit: 12 });
} catch (error) {
  if (error instanceof CheFuAcademyError) {
    if (error.statusCode === 401) {
      throw new Error('Check CHEFU_API_KEY.');
    }

    if (error.statusCode === 429) {
      throw new Error('Too many requests. Retry shortly.');
    }

    throw new Error(error.message);
  }

  throw error;
}`,
    },
    python: {
        filename: 'error_handling.py',
        language: 'python',
        code: `from chefu_academy import CheFuAcademyError

try:
    courses = client.courses.list(limit=12)
except CheFuAcademyError as error:
    if error.status_code == 401:
        raise RuntimeError("Check CHEFU_API_KEY.") from error
    if error.status_code == 429:
        raise RuntimeError("Too many requests. Retry shortly.") from error
    raise`,
    },
    go: {
        filename: 'error_handling.go',
        language: 'go',
        code: `courses, err := client.ListCourses(ctx, chefuacademy.ListOptions{Limit: 12})
if err != nil {
    var apiError *chefuacademy.Error
    if errors.As(err, &apiError) {
        switch apiError.StatusCode {
        case 401:
            return fmt.Errorf("check CHEFU_API_KEY")
        case 429:
            return fmt.Errorf("too many requests; retry shortly")
        }
    }
    return err
}
_ = courses`,
    },
    java: {
        filename: 'ErrorHandling.java',
        language: 'java',
        code: `try {
    JsonNode courses = client.listCourses(Map.of("limit", 12));
} catch (CheFuAcademyException error) {
    if (error.getStatusCode() == 401) {
        throw new IllegalStateException("Check CHEFU_API_KEY.", error);
    }
    if (error.getStatusCode() == 429) {
        throw new IllegalStateException("Too many requests. Retry shortly.", error);
    }
    throw error;
}`,
    },
    dotnet: {
        filename: 'ErrorHandling.cs',
        language: 'csharp',
        code: `try
{
    var courses = await client.ListCoursesAsync(
        new Dictionary<string, object?> { ["limit"] = 12 });
}
catch (CheFuAcademyException error) when (error.StatusCode == 401)
{
    throw new InvalidOperationException("Check CHEFU_API_KEY.", error);
}
catch (CheFuAcademyException error) when (error.StatusCode == 429)
{
    throw new InvalidOperationException("Too many requests. Retry shortly.", error);
}`,
    },
    php: {
        filename: 'error-handling.php',
        language: 'php',
        code: `try {
    $courses = $client->listCourses(['limit' => 12]);
} catch (CheFuAcademyException $error) {
    if ($error->statusCode() === 401) {
        throw new RuntimeException('Check CHEFU_API_KEY.', previous: $error);
    }
    if ($error->statusCode() === 429) {
        throw new RuntimeException('Too many requests. Retry shortly.', previous: $error);
    }
    throw $error;
}`,
    },
    ruby: {
        filename: 'error_handling.rb',
        language: 'ruby',
        code: `begin
  courses = client.list_courses(limit: 12)
rescue CheFuAcademy::Error => error
  case error.status_code
  when 401
    raise 'Check CHEFU_API_KEY.'
  when 429
    raise 'Too many requests. Retry shortly.'
  else
    raise
  end
end`,
    },
    curl: {
        filename: 'Terminal',
        language: 'bash',
        code: `response=$(curl --write-out "\\n%{http_code}" --silent --show-error \\
  --header "Authorization: Bearer $CHEFU_API_KEY" \\
  "https://api.chefuinc.com/api/courses?limit=12")

status=$(printf '%s' "$response" | tail -n1)
body=$(printf '%s' "$response" | sed '$d')

if [ "$status" -lt 200 ] || [ "$status" -ge 300 ]; then
  printf 'CheFu Academy request failed: %s\\n' "$body" >&2
  exit 1
fi`,
    },
};

export const retryExamples: LanguageSnippetMap = {
    typescript: {
        filename: 'retry.ts',
        language: 'typescript',
        code: `async function withRetry<T>(request: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await request();
  } catch (error) {
    const statusCode = error instanceof Error && 'statusCode' in error
      ? Number(error.statusCode)
      : undefined;

    if ((statusCode === 429 || statusCode >= 500) && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 800 * (3 - retries)));
      return withRetry(request, retries - 1);
    }

    throw error;
  }
}

const courses = await withRetry(() => sdk.courses.getFeatured({ limit: 6 }));`,
    },
    python: {
        filename: 'retry.py',
        language: 'python',
        code: `import time

from chefu_academy import CheFuAcademyError

def with_retry(request, retries=2):
    try:
        return request()
    except CheFuAcademyError as error:
        if error.status_code in (429, 500) and retries > 0:
            time.sleep(0.8 * (3 - retries))
            return with_retry(request, retries - 1)
        raise

courses = with_retry(lambda: client.courses.featured(limit=6))`,
    },
    go: {
        filename: 'retry.go',
        language: 'go',
        code: `func withRetry[T any](request func() (T, error), retries int) (T, error) {
    value, err := request()
    if err == nil {
        return value, nil
    }

    var apiError *chefuacademy.Error
    if errors.As(err, &apiError) &&
        (apiError.StatusCode == 429 || apiError.StatusCode >= 500) &&
        retries > 0 {
        time.Sleep(time.Duration(3-retries) * 800 * time.Millisecond)
        return withRetry(request, retries-1)
    }

    return value, err
}

courses, err := withRetry(func() (*chefuacademy.CourseListResponse, error) {
    return client.FeaturedCourses(ctx, chefuacademy.ListOptions{Limit: 6})
}, 2)`,
    },
    java: {
        filename: 'Retry.java',
        language: 'java',
        code: `JsonNode courses = retry(() ->
    client.featuredCourses(Map.of("limit", 6))
);

static JsonNode retry(Supplier<JsonNode> request) {
    int attempts = 0;
    while (true) {
        try {
            return request.get();
        } catch (CheFuAcademyException error) {
            if ((error.getStatusCode() == 429 || error.getStatusCode() >= 500) && attempts++ < 2) {
                sleep(800L * attempts);
                continue;
            }
            throw error;
        }
    }
}`,
    },
    dotnet: {
        filename: 'Retry.cs',
        language: 'csharp',
        code: `static async Task<T> WithRetry<T>(Func<Task<T>> request, int retries = 2)
{
    try
    {
        return await request();
    }
    catch (CheFuAcademyException error)
        when ((error.StatusCode == 429 || error.StatusCode >= 500) && retries > 0)
    {
        await Task.Delay(800 * (3 - retries));
        return await WithRetry(request, retries - 1);
    }
}

var courses = await WithRetry(() =>
    client.FeaturedCoursesAsync(new Dictionary<string, object?> { ["limit"] = 6 }));`,
    },
    php: {
        filename: 'retry.php',
        language: 'php',
        code: `function withRetry(callable $request, int $retries = 2): mixed
{
    try {
        return $request();
    } catch (CheFuAcademyException $error) {
        if (in_array($error->statusCode(), [429, 500], true) && $retries > 0) {
            usleep(800_000 * (3 - $retries));
            return withRetry($request, $retries - 1);
        }
        throw $error;
    }
}

$courses = withRetry(fn () => $client->featuredCourses(['limit' => 6]));`,
    },
    ruby: {
        filename: 'retry.rb',
        language: 'ruby',
        code: `def with_retry(retries = 2)
  yield
rescue CheFuAcademy::Error => error
  if [429, 500].include?(error.status_code) && retries.positive?
    sleep(0.8 * (3 - retries))
    return with_retry(retries - 1) { yield }
  end
  raise
end

courses = with_retry { client.featured_courses(limit: 6) }`,
    },
    curl: {
        filename: 'Terminal',
        language: 'bash',
        code: `for attempt in 1 2 3; do
  status=$(curl --output /tmp/chefu-response.json --write-out "%{http_code}" \\
    --silent --show-error \\
    --header "Authorization: Bearer $CHEFU_API_KEY" \\
    "https://api.chefuinc.com/api/courses/featured?limit=6")

  if [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
    cat /tmp/chefu-response.json
    break
  fi

  [ "$status" = "429" ] || [ "$status" -ge 500 ] || exit 1
  sleep "$attempt"
done`,
    },
};
