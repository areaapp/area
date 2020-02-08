package com.example.area_android

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Patterns
import android.view.WindowManager
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import org.json.JSONObject


class LoginActivity : AppCompatActivity(), LogWithServicesFragment.OnServiceLoginListener {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_login)
        val app = this.application as AreaApplication

        // Prevent keyboard to show up at activity start
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN)

        val ip = findViewById<EditText>(R.id.login_ip)
        val port = findViewById<EditText>(R.id.login_port)
        val connectButton = findViewById<Button>(R.id.login_connectButton)
        val servicesFragment = supportFragmentManager.findFragmentById(R.id.login_services_fragment)
                as LogWithServicesFragment

        connectButton.setOnClickListener {
            app.serverIp = ip.text.toString()
            app.serverPort = port.text.toString()
            app.generateServerUrl()

            servicesFragment.getServices()
        }

        val email = findViewById<EditText>(R.id.login_username)
        val password = findViewById<EditText>(R.id.login_password)
        val loginButton = findViewById<MaterialButton>(R.id.login_loginButton)

        loginButton.setOnClickListener {
            if (!Patterns.EMAIL_ADDRESS.matcher(email.text).matches()) {
                Toast.makeText(this, "Invalid email", Toast.LENGTH_SHORT).show()
            } else {
                this.basicLogin(email.text.toString(), password.text.toString())
            }

        }

        val registerButton = findViewById<MaterialButton>(R.id.login_registerButton)
        registerButton.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java) // New activity

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            finish() // Call once you redirect to another activity
        }
    }

    private fun basicLogin(email: String, password: String) {
        val app = this.application as AreaApplication
        val url = app.serverUrl + "/auth/signin"
        val data = hashMapOf<String, Any?>(
            "email" to email,
            "password" to password
        )

        Fuel.post(url)
            .jsonBody(JSONObject(data).toString())
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        println(result.error)
                        Toast.makeText(this, "Invalid credentials", Toast.LENGTH_LONG).show()
                    }
                    is Result.Success -> {
                        Toast.makeText(this, "Logged", Toast.LENGTH_SHORT).show()
                        val obj = result.get().obj()
                        val responseData: JSONObject = obj.getJSONObject("data")

                        app.token = responseData.getString("token")
                        val intent = Intent(this, MainActivity::class.java)

                        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                        startActivity(intent)
                        finish()
                    }
                }
            }
    }

    private fun enableAll() {
        findViewById<EditText>(R.id.login_username).isEnabled = true
        findViewById<EditText>(R.id.login_password).isEnabled = true
        findViewById<MaterialButton>(R.id.login_loginButton).isEnabled = true
    }

    override fun onConnectionSuccess() {
        Toast.makeText(this, "Connected to the server", Toast.LENGTH_SHORT).show()
        this.enableAll()
    }

    override fun onConnectionFailed() {
        Toast.makeText(this, "Connection to the server failed", Toast.LENGTH_LONG).show()
    }
}
